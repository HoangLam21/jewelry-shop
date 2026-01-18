'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { checkUserRole, UserRole } from '@/lib/actions/clerk.action'

export interface AuthResult {
  isAuthenticated: boolean
  userId: string | null
  role: UserRole
  userIdInDb?: string
}

/**
 * Kiểm tra user đã đăng nhập và lấy thông tin role
 * Performance: Ưu tiên đọc từ session token (JWT), fallback về database nếu cần
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Ưu tiên đọc role từ session token (nhanh - không cần gọi API)
  const roleFromToken = sessionClaims?.metadata?.role as UserRole | undefined

  if (roleFromToken && ['customer', 'staff', 'admin'].includes(roleFromToken)) {
    // Role có sẵn trong token, không cần query database
    return {
      isAuthenticated: true,
      userId,
      role: roleFromToken,
      // userIdInDb sẽ được lấy khi cần thiết
    }
  }

  // Fallback: Query database nếu role chưa có trong token
  // (Trường hợp này chỉ xảy ra nếu chưa cấu hình JWT Template)
  const roleResult = await checkUserRole(userId)
  
  if (!roleResult.success) {
    redirect('/sign-in')
  }

  return {
    isAuthenticated: true,
    userId,
    role: roleResult.role,
    userIdInDb: roleResult.userId
  }
}

/**
 * Kiểm tra user có role cụ thể
 */
export async function requireRole(requiredRole: UserRole | UserRole[]): Promise<AuthResult> {
  const authResult = await requireAuth()
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  if (!roles.includes(authResult.role)) {
    redirect('/unauthorized')
  }

  return authResult
}

/**
 * Kiểm tra user là admin
 */
export async function requireAdmin(): Promise<AuthResult> {
  return requireRole('admin')
}

/**
 * Kiểm tra user là staff hoặc admin
 */
export async function requireStaffOrAdmin(): Promise<AuthResult> {
  return requireRole(['staff', 'admin'])
}

/**
 * Kiểm tra user là customer, staff, hoặc admin
 */
export async function requireCustomerOrAbove(): Promise<AuthResult> {
  return requireRole(['customer', 'staff', 'admin'])
}

/**
 * Kiểm tra user có quyền xóa resource (chỉ admin)
 */
export async function canDelete(): Promise<boolean> {
  const authResult = await requireAuth()
  return authResult.role === 'admin'
}

/**
 * Kiểm tra user có quyền quản lý staff (chỉ admin)
 */
export async function canManageStaff(): Promise<boolean> {
  const authResult = await requireAuth()
  return authResult.role === 'admin'
}

/**
 * Kiểm tra user có quyền quản lý customer
 * Admin: full access, Staff: read-only
 */
export async function canManageCustomer(): Promise<{ canRead: boolean; canWrite: boolean }> {
  const authResult = await requireAuth()
  
  if (authResult.role === 'admin') {
    return { canRead: true, canWrite: true }
  }
  
  if (authResult.role === 'staff') {
    return { canRead: true, canWrite: false }
  }
  
  return { canRead: false, canWrite: false }
}

/**
 * Kiểm tra quyền truy cập finance
 * Staff: limited, Admin: full
 */
export async function canAccessFinance(): Promise<{ canAccess: boolean; isFullAccess: boolean }> {
  const authResult = await requireAuth()
  
  if (authResult.role === 'admin') {
    return { canAccess: true, isFullAccess: true }
  }
  
  if (authResult.role === 'staff') {
    return { canAccess: true, isFullAccess: false }
  }
  
  return { canAccess: false, isFullAccess: false }
}

/**
 * Lấy thông tin user hiện tại (không redirect)
 */
export async function getCurrentUser(): Promise<AuthResult | null> {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const roleResult = await checkUserRole(userId)
  
  if (!roleResult.success) {
    return null
  }

  return {
    isAuthenticated: true,
    userId,
    role: roleResult.role,
    userIdInDb: roleResult.userId
  }
}

