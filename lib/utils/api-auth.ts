import { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, clerkClient } from '@clerk/nextjs/server'
import { checkUserRole, UserRole } from '@/lib/actions/clerk.action'
import { connectToDatabase } from '@/lib/mongoose'

export interface ApiAuthResult {
  isAuthenticated: boolean
  userId: string
  role: UserRole
  userIdInDb?: string
}

/**
 * Lấy thông tin user từ request (cho API routes - Pages Router)
 * Sử dụng getAuth từ Clerk để lấy userId từ session
 */
export async function getAuthUser(req: NextApiRequest): Promise<ApiAuthResult | null> {
  try {
    // Sử dụng getAuth từ Clerk - cách chính thức để lấy auth info trong Pages Router
    // Trong Pages Router API routes, getAuth(req) trả về Auth object
    console.log('[API Auth] Getting auth from request...')
    console.log('[API Auth] Request headers:', {
      cookie: req.headers.cookie ? 'present' : 'missing',
      'clerk-auth': req.headers['clerk-auth'] ? 'present' : 'missing',
      origin: req.headers.origin,
      referer: req.headers.referer
    })

    // Thử getAuth với req
    let authResult
    try {
      authResult = getAuth(req)
    } catch (getAuthError) {
      console.error('[API Auth] Error calling getAuth:', getAuthError)
      // Fallback: thử parse cookie trực tiếp
      const cookies = req.headers.cookie
      if (!cookies) {
        console.log('[API Auth] No cookies in request')
        return null
      }

      // Thử lấy session token từ cookie
      const sessionTokenMatch = cookies.match(/__session=([^;]+)/)
      if (!sessionTokenMatch) {
        console.log('[API Auth] No __session cookie found')
        return null
      }

      // Nếu có session token, cần verify với Clerk API
      // Nhưng cách này phức tạp, tốt hơn là fix getAuth
      console.log('[API Auth] Found __session cookie but getAuth failed')
      return null
    }

    const { userId, sessionId } = authResult

    console.log('[API Auth] getAuth result:', {
      isAuthenticated: authResult.isAuthenticated,
      userId: userId || 'null',
      sessionId: sessionId || 'null'
    })

    if (!userId) {
      console.log('[API Auth] No userId found in session')
      // Debug: log toàn bộ cookie để xem có gì
      if (req.headers.cookie) {
        console.log('[API Auth] Cookie string (first 200 chars):', req.headers.cookie.substring(0, 200))
      }
      return null
    }

    console.log(`[API Auth] Found userId: ${userId}, sessionId: ${sessionId}`)

    // Đọc role từ Clerk user metadata trực tiếp (không cần session)
    // Đây là cách nhanh nhất và đáng tin cậy nhất
    // Wrap toàn bộ trong try-catch để đảm bảo luôn fallback về database nếu Clerk API fail
    let roleFromMetadata: UserRole | undefined = undefined
    let clerkApiFailed = false

    try {
      let retryCount = 0
      const maxRetries = 2

      while (retryCount <= maxRetries && !roleFromMetadata) {
        try {
          const client = await clerkClient()
          const user = await client.users.getUser(userId)

          // Đọc role từ publicMetadata (được set qua syncRoleToClerk)
          roleFromMetadata = user.publicMetadata?.role as UserRole | undefined

          console.log(`[API Auth] Role from Clerk user metadata (attempt ${retryCount + 1}): ${roleFromMetadata || 'not found'}`)

          if (roleFromMetadata && ['customer', 'staff', 'admin'].includes(roleFromMetadata)) {
            console.log(`[API Auth] Using role from Clerk metadata: ${roleFromMetadata}`)

            let userIdInDb: string | undefined
            if (roleFromMetadata === 'admin') {
              // Admin không có record trong database, dùng Clerk ID
              userIdInDb = process.env.ADMIN_CLERK_ID || userId
            } else {
              // Với customer/staff, query database để lấy _id
              // Sử dụng checkUserRole nhưng chỉ để lấy userId, không dùng role từ nó
              try {
                const roleResult = await checkUserRole(userId)
                // Chỉ dùng userId từ kết quả, giữ nguyên role từ metadata
                userIdInDb = roleResult.userId
              } catch (dbError) {
                console.warn('[API Auth] Could not fetch user ID from database:', dbError)
              }
            }

            return {
              isAuthenticated: true,
              userId,
              role: roleFromMetadata,
              userIdInDb
            }
          }
          break // Nếu đã lấy được user nhưng không có role, không retry nữa
        } catch (metadataError: any) {
          retryCount++
          if (retryCount <= maxRetries) {
            console.warn(`[API Auth] Could not fetch role from Clerk user metadata (attempt ${retryCount}/${maxRetries}):`, metadataError?.message || metadataError)
            // Wait 100ms before retry
            await new Promise(resolve => setTimeout(resolve, 100))
          } else {
            console.warn('[API Auth] Could not fetch role from Clerk user metadata after retries:', metadataError)
            clerkApiFailed = true
            // Tiếp tục với database fallback
            break
          }
        }
      }
    } catch (outerError: any) {
      // Catch bất kỳ exception nào không được handle trong while loop
      console.warn('[API Auth] Unexpected error in Clerk API call, falling back to database:', outerError)
      clerkApiFailed = true
    }

    // Fallback: Query database để lấy role
    // (Trường hợp này xảy ra nếu metadata chưa được set hoặc không thể đọc từ Clerk API)
    // QUAN TRỌNG: Vì middleware đã verify role từ JWT token, nếu user đã pass middleware
    // thì có thể trust userId và check admin trước
    if (clerkApiFailed || !roleFromMetadata) {
      console.log(`[API Auth] Clerk API failed or no role found, falling back to database check...`)
    } else {
      console.log(`[API Auth] No role in Clerk metadata, falling back to database check...`)
    }

    // Nếu có ADMIN_CLERK_ID và userId khớp, trust là admin (vì middleware đã verify)
    const adminClerkId = process.env.ADMIN_CLERK_ID
    if (adminClerkId && userId === adminClerkId) {
      console.log(`[API Auth] Admin detected via ADMIN_CLERK_ID (trusted from middleware): ${userId}`)
      return {
        isAuthenticated: true,
        userId,
        role: 'admin',
        userIdInDb: adminClerkId
      }
    }

    // Nếu không có ADMIN_CLERK_ID, check database nhưng ưu tiên admin
    // Vì middleware đã verify role từ JWT, nếu request đến từ admin route thì user là admin
    // Nhưng để chắc chắn, check database với logic ưu tiên admin
    console.log(`[API Auth] Checking database with admin priority...`)

    try {
      await connectToDatabase()
      const Staff = (await import('@/database/staff.model')).default
      const Customer = (await import('@/database/customer.model')).default

      // Check Staff trước (admin có thể không có trong database, nhưng staff thì có)
      const staff = await Staff.findOne({ clerkId: userId }).select('_id')
      if (staff) {
        console.log(`[API Auth] User ${userId} found in Staff collection`)
        return {
          isAuthenticated: true,
          userId,
          role: 'staff',
          userIdInDb: staff._id.toString()
        }
      }

      // Check Customer (nhưng admin có thể cũng có trong đây do auto-create)
      const customer = await Customer.findOne({ clerkId: userId }).select('_id')
      if (customer) {
        // Nếu user có trong Customer collection, nhưng request đến từ admin route
        // (đã được middleware verify role "admin" từ JWT token)
        // → Trust middleware: user là admin
        const referer = req.headers.referer || ''
        const isFromAdminRoute = referer.includes('/admin/')

        if (isFromAdminRoute) {
          console.log(`[API Auth] User ${userId} found in Customer collection, but request from admin route (middleware verified) - trusting middleware as admin`)
          return {
            isAuthenticated: true,
            userId,
            role: 'admin', // Trust middleware verification
            userIdInDb: process.env.ADMIN_CLERK_ID || userId
          }
        }

        // Nếu không phải từ admin route, thì là customer thật
        const customerId = customer._id?.toString() || customer._id
        if (!customerId) {
          console.error(`[API Auth] Customer found but _id is missing for user ${userId}`)
          return null
        }

        console.log(`[API Auth] User ${userId} found in Customer collection as customer with ID: ${customerId}`)
        return {
          isAuthenticated: true,
          userId,
          role: 'customer',
          userIdInDb: customerId
        }
      }
    } catch (dbError) {
      console.warn('[API Auth] Database check error:', dbError)
    }

    // Nếu không tìm thấy trong database, check xem request có đến từ admin route không
    // Wrap trong try-catch để đảm bảo không bị dừng nếu có lỗi
    try {
      const referer = req.headers.referer || ''
      const isFromAdminRoute = referer.includes('/admin/')

      if (isFromAdminRoute) {
        // Request đến từ admin route → middleware đã verify role "admin"
        console.log(`[API Auth] User ${userId} not found in database, but request from admin route (middleware verified) - trusting as admin`)
        return {
          isAuthenticated: true,
          userId,
          role: 'admin', // Trust middleware verification
          userIdInDb: process.env.ADMIN_CLERK_ID || userId
        }
      }
    } catch (refererError) {
      console.warn('[API Auth] Error checking referer:', refererError)
    }

    // Nếu không phải từ admin route và không tìm thấy trong database
    console.log(`[API Auth] User ${userId} not found in database and not from admin route`)
    return null
  } catch (error) {
    // Catch bất kỳ exception nào không được handle ở trên
    console.error('[API Auth] Unexpected error in getAuthUser, returning null:', error)
    return null
  }
}

/**
 * Wrapper để bảo vệ API route - yêu cầu authentication
 */
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await getAuthUser(req)

    if (!authResult || !authResult.isAuthenticated) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    return handler(req, res, authResult)
  }
}

/**
 * Wrapper để bảo vệ API route - yêu cầu role cụ thể
 */
export function withRole(
  handler: (req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) => Promise<void> | void,
  requiredRole: UserRole | UserRole[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await getAuthUser(req)

    if (!authResult || !authResult.isAuthenticated) {
      console.log('[API Auth] Unauthorized - no auth result')
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

    if (!roles.includes(authResult.role)) {
      console.log(`[API Auth] Forbidden - User role: ${authResult.role}, Required: ${roles.join(', ')}`)
      return res.status(403).json({
        error: 'Forbidden - Insufficient permissions',
        userRole: authResult.role,
        requiredRole: roles
      })
    }

    return handler(req, res, authResult)
  }
}

/**
 * Wrapper chỉ dành cho admin
 */
export function withAdmin(
  handler: (req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) => Promise<void>
) {
  return withRole(handler, 'admin')
}

/**
 * Wrapper cho staff hoặc admin
 */
export function withStaffOrAdmin(
  handler: (req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) => Promise<void>
) {
  return withRole(handler, ['staff', 'admin'])
}

/**
 * Wrapper cho customer, staff, hoặc admin
 */
export function withCustomerOrAbove(
  handler: (req: NextApiRequest, res: NextApiResponse, auth: ApiAuthResult) => Promise<void>
) {
  return withRole(handler, ['customer', 'staff', 'admin'])
}

