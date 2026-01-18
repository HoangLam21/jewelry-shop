# Hướng dẫn sử dụng Clerk Dashboard cho Phân quyền

## Tổng quan

Tài liệu này hướng dẫn cách sử dụng Clerk Dashboard để quản lý users và roles cho hệ thống jewelry-shop.

## 1. Truy cập Clerk Dashboard

1. Đăng nhập vào [Clerk Dashboard](https://dashboard.clerk.com)
2. Chọn Application tương ứng với project của bạn

## 2. Cấu hình Metadata

### 2.1. Thêm Public Metadata Field

1. Vào **Users** → **Settings** → **Metadata**
2. Click **Add field** trong phần **Public metadata**
3. Thêm field với thông tin:
   - **Key**: `role`
   - **Type**: `String`
   - **Description**: `User role: customer, staff, or admin`
4. Click **Save**

### 2.2. Giá trị Role hợp lệ

- `customer`: Người dùng thông thường
- `staff`: Nhân viên
- `admin`: Quản trị viên

### 2.3. Cấu hình JWT Template (BẮT BUỘC - KHÔNG THỂ BỎ QUA)

**🚨 BƯỚC NÀY BẮT BUỘC - HỆ THỐNG SẼ KHÔNG HOẠT ĐỘNG NẾU THIẾU**

**Lý do kỹ thuật**: Middleware chạy trên Edge Runtime (không hỗ trợ Node.js modules như Mongoose). Do đó, middleware **KHÔNG THỂ** gọi database để check role. Role **PHẢI** có sẵn trong JWT token.

Để role có sẵn trong session token, bạn **BẮT BUỘC** phải cấu hình JWT Template:

1. Vào **Configure** → **Sessions** → **Edit** (Customize Session Token)
2. Trong phần **Customize session token**, thêm đoạn JSON sau:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

3. Click **Save**

**Tại sao cần bước này?**

- ❌ **Nếu KHÔNG làm**: 
  - Middleware không thể check role (Edge Runtime không hỗ trợ database)
  - User sẽ bị redirect về `/sign-in` mỗi khi truy cập admin routes
  - Hệ thống phân quyền sẽ không hoạt động
  
- ✅ **Nếu CÓ làm**: 
  - Role nằm sẵn trong session token (cookie) của user
  - Middleware chỉ cần giải mã token là biết ngay role
  - Web nhanh, không cần gọi API hoặc database
  - Hệ thống phân quyền hoạt động hoàn hảo

**⚠️ QUAN TRỌNG**: 
- Sau khi cấu hình JWT Template, **TẤT CẢ** users phải đăng xuất và đăng nhập lại để token mới có role
- Nếu user không đăng nhập lại, họ sẽ không thể truy cập admin routes

## 3. Quản lý Users và Roles

### 3.1. Xem danh sách Users

1. Vào **Users** trong sidebar
2. Xem danh sách tất cả users đã đăng ký

### 3.2. Cập nhật Role cho User

**Cách 1: Qua Clerk Dashboard**

1. Vào **Users** → Chọn user cần cập nhật
2. Click tab **Metadata**
3. Tìm field `role` trong **Public metadata**
4. Cập nhật giá trị: `customer`, `staff`, hoặc `admin`
5. Click **Save**

**Cách 2: Qua API (Programmatically)**

Sử dụng function `updateUserRole` trong code:

```typescript
import { updateUserRole } from '@/lib/actions/clerk.action'

await updateUserRole(clerkId, 'admin')
```

**⚠️ BẢO MẬT**: Function `updateUserRole` đã được bảo vệ - chỉ admin mới có thể đổi role của người khác. Nếu user không phải admin cố gắng gọi function này, sẽ nhận lỗi "Unauthorized".

### 3.3. Xem thông tin User

1. Vào **Users** → Chọn user
2. Xem các thông tin:
   - **Profile**: Thông tin cá nhân
   - **Sessions**: Các phiên đăng nhập
   - **Metadata**: Role và metadata khác
   - **Activity**: Lịch sử hoạt động

## 4. Cấu hình Webhooks

### 4.1. Tạo Webhook Endpoint

1. Vào **Webhooks** trong sidebar
2. Click **Add Endpoint**
3. Nhập thông tin:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/clerk`
   - **Description**: `Sync users with database`
4. Click **Create**

### 4.2. Subscribe to Events

Sau khi tạo endpoint, chọn các events cần subscribe:

- ✅ `user.created` - Tự động tạo Customer record khi user đăng ký
- ✅ `user.updated` - Đồng bộ thông tin user khi có thay đổi
- ✅ `user.deleted` - Xử lý khi user bị xóa

### 4.3. Lấy Webhook Secret

1. Vào **Webhooks** → Chọn endpoint đã tạo
2. Copy **Signing Secret**
3. Thêm vào file `.env`:
   ```env
   WEBHOOK_SECRET=whsec_xxxxx
   ```

## 5. Quản lý API Keys

### 5.1. Xem API Keys

1. Vào **API Keys** trong sidebar (hoặc **Configure** → **API Keys**)
2. Xem các keys:
   - **Publishable Key**: Dùng cho client-side (bắt đầu với `pk_test_` hoặc `pk_live_`)
   - **Secret Key**: Dùng cho server-side (bắt đầu với `sk_test_` hoặc `sk_live_`)

### 5.2. Cập nhật Environment Variables

Đảm bảo các biến môi trường sau được cấu hình trong `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
ADMIN_CLERK_ID=user_xxxxx
WEBHOOK_SECRET=whsec_xxxxx
```

## 6. Testing Roles

### 6.1. Tạo Test Users

1. Vào **Users** → **Create user**
2. Tạo các users với roles khác nhau:
   - Customer user
   - Staff user
   - Admin user (set `ADMIN_CLERK_ID` trong `.env`)

### 6.2. Verify Role Checks

1. Đăng nhập với từng user
2. Kiểm tra:
   - Customer chỉ có thể truy cập public routes và cart/checkout
   - Staff có thể truy cập admin dashboard nhưng không thể quản lý staff
   - Admin có full access

## 7. Best Practices

### 7.1. Role Management

- ✅ Luôn sync role giữa Clerk metadata và Database
- ✅ Sử dụng Clerk metadata làm source of truth chính
- ✅ Database chỉ lưu thông tin chi tiết user

### 7.2. Security

- ✅ Không expose Secret Key trong client-side code
- ✅ Sử dụng environment variables cho tất cả keys
- ✅ Enable webhook signature verification
- ✅ Regularly rotate API keys

### 7.3. Monitoring

- ✅ Xem **Logs** trong Clerk Dashboard để monitor authentication events
- ✅ Check **Sessions** để xem active users
- ✅ Review **Activity** logs để phát hiện suspicious activities

## 8. Troubleshooting

### 8.1. User không có role hoặc bị redirect về sign-in

**Vấn đề**: User đăng nhập nhưng không có role trong metadata, hoặc bị redirect về `/sign-in` khi truy cập admin routes

**Giải pháp**:
1. **Kiểm tra JWT Template đã cấu hình chưa** (QUAN TRỌNG NHẤT):
   - Vào Configure → Sessions → Edit
   - Đảm bảo có `{"metadata": "{{user.public_metadata}}"}` trong JWT Template
   - Nếu chưa có, thêm vào và Save
   - **Lưu ý**: Middleware chạy trên Edge Runtime, không thể gọi database. JWT Template là BẮT BUỘC.

2. **Kiểm tra role trong Public metadata**:
   - Vào Users → Chọn user → Metadata tab
   - Đảm bảo có field `role` với giá trị: `customer`, `staff`, hoặc `admin`

3. **User phải đăng nhập lại**:
   - Sau khi cấu hình JWT Template hoặc cập nhật role
   - User **PHẢI** đăng xuất và đăng nhập lại để token mới có role
   - Token cũ không có role sẽ không hoạt động

4. **Nếu user mới đăng ký**:
   - User sẽ được tự động tạo với role `customer` qua webhook
   - Nhưng vẫn cần đảm bảo JWT Template đã được cấu hình

### 8.2. Webhook không hoạt động

**Vấn đề**: Webhook không nhận được events

**Giải pháp**:
1. Kiểm tra endpoint URL có đúng không
2. Verify webhook secret trong `.env`
3. Check logs trong Clerk Dashboard → Webhooks → Endpoint → Logs

### 8.3. Role không sync

**Vấn đề**: Role trong Clerk metadata không khớp với database

**Giải pháp**:
1. Sử dụng function `syncRoleToClerk` để đồng bộ
2. Hoặc cập nhật thủ công trong Clerk Dashboard
3. Verify database có record tương ứng

### 8.4. Lỗi "Failed to load Clerk" hoặc "ERR_CONNECTION_RESET"

**Vấn đề**: Clerk không thể load, xuất hiện lỗi:
- `ClerkRuntimeError: Failed to load Clerk (code="failed_to_load_clerk_js_timeout")`
- `ERR_CONNECTION_RESET`
- `script-src' was not explicitly set`

**Giải pháp**:

1. **Kiểm tra Environment Variables** (QUAN TRỌNG NHẤT):
   ```bash
   # Kiểm tra file .env hoặc .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```
   - Đảm bảo `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` đã được set
   - Key phải bắt đầu với `pk_test_` hoặc `pk_live_`
   - **Restart dev server** sau khi thêm/sửa env variables

2. **Kiểm tra Network/Firewall**:
   - Clerk cần kết nối đến `*.clerk.accounts.dev` và `*.clerk.com`
   - Kiểm tra firewall/proxy có block không
   - Thử tắt VPN nếu đang dùng

3. **Clear Browser Cache**:
   - Clear cache và cookies
   - Hoặc dùng Incognito/Private mode
   - Hard refresh: `Ctrl+Shift+R` (Windows) hoặc `Cmd+Shift+R` (Mac)

4. **Kiểm tra CSP Headers**:
   - File `next.config.ts` đã được cấu hình để allow Clerk scripts
   - Nếu bạn có custom CSP headers, đảm bảo cho phép:
     - `https://*.clerk.accounts.dev`
     - `https://*.clerk.com`
     - `wss://*.clerk.accounts.dev` (cho WebSocket)

5. **Kiểm tra Console Logs**:
   - Mở Browser DevTools → Console
   - Xem có lỗi network nào không
   - Kiểm tra tab Network xem request đến Clerk có fail không

6. **Verify Clerk Application**:
   - Vào Clerk Dashboard → API Keys
   - Đảm bảo Application đang active
   - Kiểm tra có bị rate limit không

7. **Restart Development Server**:
   ```bash
   # Stop server (Ctrl+C)
   # Then restart
   npm run dev
   ```

8. **Nếu vẫn lỗi, thử explicit configuration**:
   - File `app/layout.tsx` đã được cập nhật với `publishableKey` prop
   - Đảm bảo env variable được load đúng

## 9. Migration Existing Users

Nếu bạn có users hiện tại trong database nhưng chưa có role trong Clerk metadata:

1. Tạo script migration để:
   - Lấy tất cả users từ database
   - Sync role lên Clerk metadata cho mỗi user
2. Hoặc cập nhật thủ công từng user trong Clerk Dashboard

## 10. TypeScript Configuration

Nếu bạn sử dụng TypeScript, cần khai báo type cho `CustomJwtSessionClaims` để tránh lỗi khi truy cập `sessionClaims.metadata.role`.

Tạo file `types/clerk.d.ts`:

```typescript
export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "staff" | "customer";
    };
  }
}
```

File này đã được tạo sẵn trong project. TypeScript sẽ tự động nhận diện type này.

## 11. Support

Nếu gặp vấn đề:
- Xem [Clerk Documentation](https://clerk.com/docs)
- Check [Clerk Community](https://clerk.com/community)
- Review logs trong Clerk Dashboard

