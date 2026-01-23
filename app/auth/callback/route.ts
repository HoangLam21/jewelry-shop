import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { checkUserRole } from '@/lib/actions/clerk.action'

/**
 * Route callback sau khi đăng nhập thành công
 * Redirect user dựa trên role:
 * - Admin/Staff → /admin
 * - Customer → /
 */
export async function GET() {
  console.log('[Auth Callback] ========== CALLBACK ROUTE CALLED ==========')

  try {
    const { userId, sessionClaims } = await auth()

    console.log('[Auth Callback] User ID:', userId)
    console.log('[Auth Callback] Session Claims:', JSON.stringify(sessionClaims, null, 2))

    if (!userId) {
      // Nếu chưa đăng nhập, redirect về sign-in
      console.log('[Auth Callback] ❌ No userId, redirecting to /sign-in')
      redirect('/sign-in')
      return // Prevent further execution
    }

    // Ưu tiên đọc role từ JWT token (nhanh, không cần query database)
    // Giống như middleware và API routes
    const roleFromToken = sessionClaims?.metadata?.role as 'admin' | 'staff' | 'customer' | undefined

    console.log('[Auth Callback] Role from token:', roleFromToken)
    console.log('[Auth Callback] Full metadata:', JSON.stringify(sessionClaims?.metadata, null, 2))

    let role: 'admin' | 'staff' | 'customer' | null = null

    if (roleFromToken && ['customer', 'staff', 'admin'].includes(roleFromToken)) {
      // Role có sẵn trong JWT token
      role = roleFromToken
      console.log(`[Auth Callback] ✅ Role from JWT token: ${role}`)
    } else {
      // Fallback: Query database nếu role chưa có trong token
      // (Trường hợp này chỉ xảy ra nếu chưa cấu hình JWT Template hoặc user chưa đăng nhập lại)
      console.log(`[Auth Callback] ⚠️ No role in JWT token, falling back to database check...`)
      const roleResult = await checkUserRole(userId)

      if (!roleResult.success || !roleResult.role) {
        // Nếu không có role, redirect về trang chủ
        console.log(`[Auth Callback] ❌ User ${userId} has no role assigned`)
        redirect('/')
      }

      role = roleResult.role
      console.log(`[Auth Callback] ✅ Role from database: ${role}`)
    }

    // Redirect dựa trên role
    if (role === 'admin' || role === 'staff') {
      console.log(`[Auth Callback] 🔄 Redirecting ${role} to /admin`)
      console.log(`[Auth Callback] About to call redirect('/admin')...`)
      redirect('/admin')
    } else {
      // Customer hoặc role khác → trang chủ
      console.log(`[Auth Callback] 🔄 Redirecting ${role} to /`)
      redirect('/')
    }
  } catch (error) {
    console.error('[Auth Callback] ❌ Error:', error)
    console.error('[Auth Callback] Error stack:', error instanceof Error ? error.stack : 'No stack')
    // Nếu có lỗi, redirect về trang chủ
    redirect('/')
  }
}
