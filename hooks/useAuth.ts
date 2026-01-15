'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/lib/actions/clerk.action'

export interface AuthState {
  isLoaded: boolean
  isAuthenticated: boolean
  userId: string | null
  role: UserRole | null
  isLoadingRole: boolean
}

/**
 * Hook để lấy user và role hiện tại
 */
export function useAuth(): AuthState {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoadingRole, setIsLoadingRole] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) {
        setRole(null)
        setIsLoadingRole(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/role?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setRole(data.role)
        } else {
          setRole(null)
        }
      } catch (error) {
        console.error('Error fetching role:', error)
        setRole(null)
      } finally {
        setIsLoadingRole(false)
      }
    }

    if (isLoaded && user) {
      fetchRole()
    } else if (isLoaded && !user) {
      setRole(null)
      setIsLoadingRole(false)
    }
  }, [user, isLoaded])

  return {
    isLoaded,
    isAuthenticated: !!user,
    userId: user?.id || null,
    role,
    isLoadingRole,
  }
}

/**
 * Hook redirect nếu chưa đăng nhập
 */
export function useRequireAuth() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.isLoaded && !auth.isAuthenticated) {
      router.push('/sign-in')
    }
  }, [auth.isLoaded, auth.isAuthenticated, router])

  return auth
}

/**
 * Hook redirect nếu không có role
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.isLoaded && auth.isAuthenticated && !auth.isLoadingRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      
      if (!auth.role || !roles.includes(auth.role)) {
        router.push('/unauthorized')
      }
    }
  }, [auth, requiredRole, router])

  return auth
}

/**
 * Hook kiểm tra user có phải admin không
 */
export function useRequireAdmin() {
  return useRequireRole('admin')
}

/**
 * Hook kiểm tra user có phải staff hoặc admin không
 */
export function useRequireStaffOrAdmin() {
  return useRequireRole(['staff', 'admin'])
}



