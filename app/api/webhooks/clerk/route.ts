// Note: Install svix package: npm install svix
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createOrGetCustomer } from '@/lib/actions/clerk.action'
import { syncRoleToClerk } from '@/lib/actions/clerk.action'
import Customer from '@/database/customer.model'
import Staff from '@/database/staff.model'
import { connectToDatabase } from '@/lib/mongoose'

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, first_name, last_name, email_addresses, phone_numbers } = evt.data

    // ✅ Transform email_addresses và phone_numbers về đúng format
    const result = await createOrGetCustomer({
      id,
      firstName: first_name || '',
      lastName: last_name || '',
      emailAddresses: email_addresses?.map(email => ({
        emailAddress: email.email_address
      })) || [],
      phoneNumbers: phone_numbers?.map(phone => ({
        phoneNumber: phone.phone_number
      })) || [],
    })

    if (result.success) {
      // Sync role lên Clerk metadata
      await syncRoleToClerk(id, 'customer')
    }

    return new Response('User created successfully', { status: 200 })
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, phone_numbers } = evt.data

    try {
      await connectToDatabase()

      // Cập nhật thông tin customer nếu có
      const customer = await Customer.findOne({ clerkId: id })
      if (customer) {
        customer.fullName = `${first_name || ''} ${last_name || ''}`.trim()
        customer.email = email_addresses?.[0]?.email_address || customer.email
        customer.phoneNumber = phone_numbers?.[0]?.phone_number || customer.phoneNumber
        await customer.save()
      }

      // Cập nhật thông tin staff nếu có
      const staff = await Staff.findOne({ clerkId: id })
      if (staff) {
        staff.fullName = `${first_name || ''} ${last_name || ''}`.trim()
        staff.email = email_addresses?.[0]?.email_address || staff.email
        staff.phoneNumber = phone_numbers?.[0]?.phone_number || staff.phoneNumber
        await staff.save()
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }

    return new Response('User updated successfully', { status: 200 })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await connectToDatabase()

      // Soft delete - chỉ đánh dấu, không xóa thực sự
      const customer = await Customer.findOne({ clerkId: id })
      if (customer) {
        // Có thể thêm field deletedAt nếu cần
        // customer.deletedAt = new Date()
        // await customer.save()
        // Hoặc xóa thực sự nếu cần
        // await Customer.deleteOne({ clerkId: id })
      }

      const staff = await Staff.findOne({ clerkId: id })
      if (staff) {
        // Tương tự cho staff
        // await Staff.deleteOne({ clerkId: id })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }

    return new Response('User deleted successfully', { status: 200 })
  }

  return new Response('Webhook received', { status: 200 })
}