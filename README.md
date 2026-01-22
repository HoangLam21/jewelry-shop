# Jewelry Shop - Hệ thống Quản lý Trang sức

Đây là dự án [Next.js](https://nextjs.org) được tạo bằng [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🔐 Xác thực & Phân quyền

Dự án này sử dụng **Clerk** cho xác thực và triển khai **Role-Based Access Control (RBAC)** với ba vai trò:

- **Customer**: Có thể xem sản phẩm và quản lý giỏ hàng/đơn hàng của chính họ
- **Staff**: Có thể truy cập admin dashboard và quản lý sản phẩm/đơn hàng (CRU, không có Delete)
- **Admin**: Toàn quyền truy cập tất cả các module

## 📋 Yêu cầu

### Dependencies cần thiết

Để webhook hoạt động, cần cài đặt:

```bash
npm install svix
```

### Environment Variables

Tạo file `.env.local` hoặc `.env` trong thư mục gốc với các biến sau:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Admin Configuration
ADMIN_CLERK_ID=user_xxxxx

# Webhook Configuration (cho local development với ngrok)
WEBHOOK_SECRET=whsec_xxxxx

# Database (nếu cần)
MONGODB_URI=mongodb://localhost:27017/jewelry-shop
```

## 🚀 Bắt đầu

### 1. Cài đặt Dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 2. Cấu hình Clerk

Xem hướng dẫn chi tiết trong [CLERK_DASHBOARD_GUIDE.md](./CLERK_DASHBOARD_GUIDE.md) để:

- Tạo Clerk Application
- Cấu hình JWT Template (BẮT BUỘC)
- Thiết lập Webhook với ngrok
- Cấu hình Metadata và Roles

### 3. Setup ngrok cho Webhook (Local Development)

**Bước 1: Đăng ký tài khoản ngrok**

1. Truy cập [https://ngrok.com](https://ngrok.com)
2. Đăng ký tài khoản miễn phí
3. Lấy Auth Token từ dashboard

**Bước 2: Cài đặt ngrok**

```bash
# Windows (với Chocolatey)
choco install ngrok

# macOS (với Homebrew)
brew install ngrok

# Hoặc tải từ: https://ngrok.com/download
```

**Bước 3: Xác thực ngrok**

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**Bước 4: Tạo Domain cố định (Khuyến nghị)**

1. Truy cập [https://dashboard.ngrok.com/cloud-edge/domains](https://dashboard.ngrok.com/cloud-edge/domains)
2. Tạo domain dạng: `ten-cua-ban.ngrok-free.dev`
3. Copy domain đã tạo

**Bước 5: Chạy ngrok với domain cố định**

```bash
ngrok http 3000 --domain=ten-cua-ban.ngrok-free.dev
```

Hoặc nếu không dùng domain cố định:

```bash
ngrok http 3000
```

**Bước 6: Cấu hình Webhook trong Clerk**

1. Copy HTTPS URL từ ngrok (ví dụ: `https://ten-cua-ban.ngrok-free.dev`)
2. Vào Clerk Dashboard → **Webhooks** → **Add Endpoint**
3. Nhập **Endpoint URL**: `https://ten-cua-ban.ngrok-free.dev/api/webhooks/clerk`
4. Subscribe các events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Copy **Signing Secret** và thêm vào `.env`:

   ```env
   WEBHOOK_SECRET=whsec_xxxxx
   ```

### 4. Chạy Development Server

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

**⚠️ Lưu ý quan trọng:**

- **Phải chạy ngrok trước** khi start dev server để webhook hoạt động
- Nếu dùng domain cố định, URL webhook sẽ không đổi mỗi lần restart
- Nếu không dùng domain cố định, phải cập nhật lại webhook URL trong Clerk mỗi lần ngrok restart

## 📚 Tài liệu

- [CLERK_DASHBOARD_GUIDE.md](./CLERK_DASHBOARD_GUIDE.md) - Hướng dẫn chi tiết về Clerk Dashboard và cấu hình
- [Next.js Documentation](https://nextjs.org/docs) - Tài liệu Next.js
- [Clerk Documentation](https://clerk.com/docs) - Tài liệu Clerk

## 🏗️ Cấu trúc Dự án

```
jewelry-shop/
├── app/                    # App Router (Next.js 13+)
│   ├── (root)/            # Public routes
│   │   ├── (home)/        # Trang chủ
│   │   ├── product/       # Sản phẩm
│   │   ├── cart/          # Giỏ hàng
│   │   ├── checkout/       # Thanh toán
│   │   └── order-success/  # Trang thành công
│   ├── admin/             # Admin routes (protected)
│   └── api/               # API routes
│       └── webhooks/      # Webhook handlers
├── pages/                 # Pages Router (API routes)
│   └── api/               # API endpoints
├── lib/                   # Utilities & Actions
├── components/            # React Components
├── database/              # Database Models
└── middleware.ts          # Route protection
```

## 🔧 Scripts

```bash
# Development
npm run dev

# Build cho production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚢 Deploy

Cách dễ nhất để deploy Next.js app là sử dụng [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Xem [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) để biết thêm chi tiết.

### Deploy với Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm Environment Variables trong Vercel Dashboard
4. Deploy!

**Lưu ý khi deploy:**

- Webhook URL sẽ là: `https://yourdomain.com/api/webhooks/clerk`
- Không cần ngrok khi deploy production
- Đảm bảo tất cả environment variables đã được set trong Vercel

## 🐛 Troubleshooting

### Webhook không hoạt động

1. Kiểm tra ngrok đang chạy: `ngrok http 3000`
2. Verify webhook URL trong Clerk Dashboard
3. Kiểm tra `WEBHOOK_SECRET` trong `.env`
4. Xem logs trong Clerk Dashboard → Webhooks → Logs

### User không có role sau khi đăng ký

1. Kiểm tra webhook đã được cấu hình đúng chưa
2. Xem console logs khi user đăng ký
3. Kiểm tra JWT Template đã được cấu hình trong Clerk
4. User phải đăng xuất và đăng nhập lại sau khi cấu hình JWT Template

## 📝 License

MIT
