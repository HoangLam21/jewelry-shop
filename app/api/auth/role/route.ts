import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkUserRole } from '@/lib/actions/clerk.action'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const requestedUserId = searchParams.get('userId')

    // Chỉ cho phép user xem role của chính mình hoặc admin/staff có thể xem role của người khác
    if (requestedUserId && requestedUserId !== userId) {
      // Kiểm tra nếu user hiện tại là admin hoặc staff
      const currentUserRole = await checkUserRole(userId)
      if (currentUserRole.role !== 'admin' && currentUserRole.role !== 'staff') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const targetUserId = requestedUserId || userId
    const roleResult = await checkUserRole(targetUserId)

    if (!roleResult.success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ role: roleResult.role })
  } catch (error) {
    console.error('Error fetching role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



