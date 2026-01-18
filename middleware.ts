import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Định nghĩa các routes cần authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/product(.*)',
  '/about-us',
  '/contact',
  '/api/product(.*)',
  '/api/category(.*)',
  '/auth/callback', // Route callback sau khi đăng nhập
])

// Routes yêu cầu customer, staff, hoặc admin
const isCustomerRoute = createRouteMatcher([
  '/cart(.*)',
  '/checkout(.*)',
  '/profile(.*)',
  '/orders(.*)',
])

// Routes yêu cầu staff hoặc admin
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

// Routes chỉ dành cho admin
const isAdminOnlyRoute = createRouteMatcher([
  '/admin/staff(.*)',
  '/admin/customer/add',
  '/admin/customer/edit(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const url = req.nextUrl.clone()

  // Lấy role từ session token (đã được nhúng vào JWT qua JWT Template)
  // Performance: Không cần gọi API, role có sẵn trong token
  const role = sessionClaims?.metadata?.role as 'admin' | 'staff' | 'customer' | undefined

  // Debug logging cho admin routes
  if (isAdminRoute(req)) {
    console.log(`[Middleware] Admin route access attempt - userId: ${userId}, role: ${role}, path: ${req.nextUrl.pathname}`)
    console.log(`[Middleware] sessionClaims?.metadata:`, JSON.stringify(sessionClaims?.metadata))
  }

  // Public routes - không cần authentication
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Customer routes - yêu cầu authentication
  if (isCustomerRoute(req)) {
    if (!userId) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Admin routes - yêu cầu staff hoặc admin
  if (isAdminRoute(req)) {
    if (!userId) {
      console.log(`[Middleware] Admin route blocked - No userId`)
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    // ⚠️ QUAN TRỌNG: Middleware chạy trên Edge Runtime, không thể gọi database
    // Phải sử dụng role từ JWT token (đã cấu hình qua JWT Template)
    // Nếu chưa cấu hình JWT Template, role sẽ là undefined và user sẽ bị redirect
    if (!role) {
      // Nếu không có role trong token, có thể:
      // 1. Chưa cấu hình JWT Template trong Clerk Dashboard
      // 2. User chưa đăng nhập lại sau khi cấu hình JWT Template
      // 3. Role chưa được set trong Clerk metadata
      console.log(`[Middleware] Admin route blocked - No role in token. userId: ${userId}`)
      console.log(`[Middleware] Full sessionClaims:`, JSON.stringify(sessionClaims))
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    // Sử dụng role từ session token (nhanh, không cần gọi database)
    // Admin-only routes
    if (isAdminOnlyRoute(req)) {
      if (role !== 'admin') {
        console.log(`[Middleware] Admin-only route blocked - User role: ${role}, Required: admin`)
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
    } else {
      // Admin dashboard và các routes khác - yêu cầu staff hoặc admin
      if (role !== 'admin' && role !== 'staff') {
        console.log(`[Middleware] Admin route blocked - User role: ${role}, Required: admin or staff`)
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
    }

    console.log(`[Middleware] Admin route allowed - User role: ${role}, path: ${req.nextUrl.pathname}`)
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}