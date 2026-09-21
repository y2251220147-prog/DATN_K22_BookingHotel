# booking_Frontend

Frontend cho hệ thống đặt phòng khách sạn, xây dựng bằng Next.js 15 + TypeScript + Tailwind CSS.

---

## Mục lục

- [Tính năng](#tính-năng)
- [Tech Stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt](#cài-đặt)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)
- [Pages & Routes](#pages--routes)
- [Deploy với Docker](#deploy-với-docker)

---

## Tính năng

### Phía khách hàng
- Tìm kiếm & lọc phòng theo ngày, loại, giá
- Xem chi tiết phòng, thư viện ảnh, bản đồ tích hợp (Leaflet)
- Đặt phòng trực tuyến, thanh toán qua PayOS (QR Code)
- Đăng ký / đăng nhập: Email, Google OAuth, nhận diện khuôn mặt
- Voice assistant tư vấn đặt phòng bằng giọng nói (AI)
- Chat realtime với nhân viên (Pusher + Socket.io)
- Xem lịch sử đặt phòng, đánh giá sau checkout
- Blog khách sạn với nội dung Markdown

### Phía quản trị (Admin Dashboard)
- Quản lý đặt phòng: danh sách, tạo thủ công, xác nhận, in hóa đơn
- Quản lý phòng: CRUD, loại phòng, tiện nghi, lịch bảo trì
- Định giá động theo mùa (Seasonal Rates)
- Quản lý người dùng: khách hàng, nhân viên, vai trò & phân quyền (RBAC)
- Viết blog với rich text editor (TipTap)
- Quản lý đánh giá & audit log
- Quản lý mã giảm giá
- Thống kê & biểu đồ doanh thu (Recharts)
- Thông báo realtime qua Pusher

---

## Tech Stack

| Thành phần | Công nghệ |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Ngôn ngữ | TypeScript 5 |
| Styling | Tailwind CSS 4, DaisyUI 5 |
| UI Components | Shadcn/ui, Radix UI |
| State Management | Zustand 5 |
| Data Fetching | SWR 2, Axios |
| Realtime | Pusher.js, Socket.io-client |
| Xác thực | JWT (jose, jwt-decode), Google OAuth |
| Nhận diện khuôn mặt | face-api.js |
| Upload file | Uploadthing |
| Rich Text Editor | TipTap 2, React Quill |
| Biểu đồ | Recharts 3 |
| Bản đồ | Leaflet + react-leaflet |
| Lịch / Ngày | React Calendar, React DatePicker, date-fns, Moment.js |
| QR Code | qrcode.react, react-qr-code |
| Carousel | Swiper, Embla Carousel |
| Animation | Framer Motion |
| Icons | Lucide React, Heroicons, React Icons |

---

## Cấu trúc thư mục

```
booking_Frontend/
├── src/
│   ├── app/
│   │   ├── (client)/              # Giao diện khách hàng
│   │   │   ├── page.tsx           # Trang chủ
│   │   │   ├── layout.tsx         # Layout client
│   │   │   ├── components/        # Header, footer, hero, chat...
│   │   │   ├── about/             # Giới thiệu
│   │   │   ├── gallery/           # Thư viện ảnh
│   │   │   ├── blog/              # Blog listing & detail
│   │   │   ├── rooms/             # Danh sách & chi tiết phòng
│   │   │   ├── profile/           # Trang cá nhân, lịch sử đặt phòng
│   │   │   ├── signIn/            # Đăng nhập
│   │   │   ├── signUp/            # Đăng ký
│   │   │   ├── forgot-password/   # Quên / đặt lại mật khẩu
│   │   │   ├── auth/google/       # Google OAuth callback
│   │   │   └── payment/           # Trang kết quả thanh toán
│   │   │
│   │   ├── (dashboard)/           # Admin dashboard (protected)
│   │   │   └── admin/
│   │   │       ├── page.tsx       # Dashboard tổng quan
│   │   │       ├── bookings/      # Quản lý đặt phòng
│   │   │       ├── rooms/         # Quản lý phòng
│   │   │       ├── users/         # Quản lý người dùng & vai trò
│   │   │       ├── blog/          # Quản lý blog
│   │   │       ├── reviews/       # Đánh giá & audit log
│   │   │       ├── discounts/     # Mã giảm giá
│   │   │       ├── seasonal-rates/# Định giá theo mùa
│   │   │       ├── statiscal/     # Thống kê & báo cáo
│   │   │       └── profile/       # Hồ sơ admin
│   │   │
│   │   ├── api/uploadthing/       # API route upload file
│   │   ├── layout.tsx             # Root layout
│   │   ├── not-found.tsx          # Trang 404
│   │   └── globals.css            # CSS toàn cục
│   │
│   ├── components/ui/             # Shadcn/ui components
│   ├── hooks/                     # Custom React hooks
│   │   ├── useUserStore.ts        # Zustand store cho user
│   │   ├── useVoiceAssistant.ts   # Voice AI assistant
│   │   ├── useFaceLogin.ts        # Đăng nhập khuôn mặt
│   │   └── useChatSession.ts      # Quản lý phiên chat
│   │
│   ├── lib/                       # Tiện ích
│   │   ├── axios.ts               # Axios instance + interceptors
│   │   ├── verifyToken.ts         # Xác thực JWT
│   │   ├── pusher.ts              # Pusher client config
│   │   ├── formatDate.ts          # Format ngày tháng
│   │   ├── formatPrice.ts         # Format giá tiền
│   │   └── fetcher.ts             # SWR fetcher
│   │
│   └── services/
│       └── ApiService.ts          # Các hàm gọi API
│
├── public/
│   ├── images/                    # Ảnh tĩnh
│   └── models/                    # Models face-api.js
│
├── next.config.ts                 # Cấu hình Next.js
├── tailwind.config.mjs            # Cấu hình Tailwind CSS
├── components.json                # Cấu hình Shadcn/ui
├── Dockerfile                     # Multi-stage Docker build
├── docker-compose.yml             # Docker Compose
└── .env                           # Biến môi trường
```

---

## Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd booking_Frontend

# Cài dependencies
npm install

# Khởi động dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

> Yêu cầu: Node.js >= 18, backend đang chạy tại cổng được cấu hình trong `NEXT_PUBLIC_URL_API`.

---

## Biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
# Backend API URL
NEXT_PUBLIC_URL_API=http://localhost:5000

# JWT
JWT_SECRET=your_jwt_secret

# Uploadthing
UPLOADTHING_TOKEN=

# Pusher (Realtime)
NEXT_PUBLIC_PUSHER_KEY=

# Google Sheets (nếu dùng)
NEXT_PUBLIC_API_GGSHEET=
NEXT_PUBLIC_GGSHEETID=
```

---

## Scripts

```bash
npm run dev      # Chạy development server (port 3000)
npm run build    # Build production
npm run start    # Chạy production server
npm run lint     # Kiểm tra lỗi ESLint
```

---

## Pages & Routes

### Client (`/`)

| Route | Mô tả |
| --- | --- |
| `/` | Trang chủ: tìm kiếm, showcase phòng, bản đồ |
| `/about` | Giới thiệu khách sạn |
| `/gallery` | Thư viện ảnh |
| `/blog` | Danh sách bài viết |
| `/blog/[slug]` | Chi tiết bài viết |
| `/rooms/[id]` | Danh sách phòng của khách sạn |
| `/rooms/[id]/[roomId]` | Chi tiết phòng |
| `/profile` | Trang cá nhân |
| `/profile/bookings` | Lịch sử đặt phòng |
| `/profile/reviews` | Đánh giá của tôi |
| `/profile/change-password` | Đổi mật khẩu |
| `/signIn` | Đăng nhập |
| `/signUp` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |
| `/forgot-password/reset-password` | Đặt lại mật khẩu |
| `/auth/google/callback` | Google OAuth callback |
| `/payment/success` | Thanh toán thành công |
| `/payment/cancel` | Thanh toán bị hủy |

### Admin Dashboard (`/admin`)

| Route | Mô tả |
| --- | --- |
| `/admin` | Dashboard tổng quan |
| `/admin/bookings/listbooking` | Danh sách đặt phòng |
| `/admin/bookings/add-booking` | Tạo đặt phòng thủ công |
| `/admin/rooms/room` | Quản lý phòng |
| `/admin/rooms/room-types` | Loại phòng |
| `/admin/rooms/amenities` | Tiện nghi |
| `/admin/rooms/maintenance` | Lịch bảo trì |
| `/admin/users/customers` | Danh sách khách hàng |
| `/admin/users/employees` | Danh sách nhân viên |
| `/admin/users/roles` | Vai trò & phân quyền |
| `/admin/blog` | Quản lý blog |
| `/admin/reviews` | Quản lý đánh giá |
| `/admin/reviews/audit-logs` | Audit log |
| `/admin/discounts` | Mã giảm giá |
| `/admin/seasonal-rates` | Định giá theo mùa |
| `/admin/statiscal` | Thống kê & biểu đồ |
| `/admin/profile` | Hồ sơ admin |

---

## Deploy với Docker

```bash
# Build image
docker build -t booking-frontend .

# Hoặc dùng Docker Compose
docker-compose up -d
```

Dockerfile sử dụng multi-stage build (Node 22 Alpine), output standalone, expose port 3000.
