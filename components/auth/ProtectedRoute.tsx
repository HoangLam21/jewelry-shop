'use client'

import React from 'react'
import { useRequireAuth, useRequireRole, AuthState } from '@/hooks/useAuth'
import { UserRole } from '@/lib/actions/clerk.action'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) {
  const auth: AuthState = requireAuth
    ? requiredRole
      ? useRequireRole(requiredRole)
      : useRequireAuth()
    : useRequireAuth()

  // Loading state
  if (!auth.isLoaded || auth.isLoadingRole) {
    return (
      fallback || (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="loader"></div>
        </div>
      )
    )
  }

  // Not authenticated
  if (requireAuth && !auth.isAuthenticated) {
    return (
      fallback || (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
            <p>Please sign in to access this page.</p>
          </div>
        </div>
      )
    )
  }

  // Role check failed
  if (requiredRole && auth.role) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(auth.role)) {
      return (
        fallback || (
          <div className="flex h-screen w-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p>You don't have permission to access this page.</p>
            </div>
          </div>
        )
      )
    }
  }

  return <>{children}</>
}



