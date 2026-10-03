# BỘ NHỚ DỰ ÁN

## Trạng thái hiện tại

- Cập nhật lần đầu: 2026-09-21.
- Đây là một monorepo gồm hai ứng dụng độc lập: `booking_Frontend` và `booking_Backend`.
- Không có thay đổi chức năng, package mới hoặc thay đổi database trong lần ingestion này.
- Source thực tế là nguồn chính; tài liệu này chỉ ghi các phần đã kiểm tra được.

## Bản đồ thư mục

### Frontend (`booking_Frontend`)

- Next.js App Router, TypeScript, React 19, Tailwind CSS 4 và các component Radix/shadcn-style.
- `src/app/(client)`: website khách hàng gồm trang chủ, phòng, đặt phòng, thanh toán, blog, gallery, hồ sơ, đăng nhập/đăng ký và quên mật khẩu.
- `src/app/(dashboard)/admin`: dashboard nhân viên/quản trị gồm booking, phòng, loại phòng, tiện nghi, bảo trì, mùa giá, giảm giá, blog, người dùng, vai trò, review, audit log và thống kê.
- `src/app/api/uploadthing`: route/core cho UploadThing.
- `src/components/ui`: component UI tái sử dụng.
- `src/hook`: Zustand stores và React hooks cho user, booking, face login, voice/chat, debounce và room type.
- `src/lib`: axios/fetcher, auth/roles, format/price/date, Pusher, dịch, face-api loader, export Excel và tiện ích chung.
- `src/services/ApiService.ts`: các lời gọi nghiệp vụ tạo customer, booking nhân viên và payment nhân viên.
- `src/proxy.ts`: bảo vệ route `/admin`, `/signIn`, `/signUp` theo JWT và role.
- `public`: ảnh, SVG, model face-api và tài nguyên giao diện.

### Backend (`booking_Backend`)

- Node.js ES modules, Express 5, Prisma Client và MySQL.
- `server.js`: khởi tạo Express, JSON/CORS/cookie/session/passport, đăng ký router dưới `/api/*` và lắng nghe cổng từ `PORT` (mặc định 5000).
- `api`: 16 router cho auth/user/employee/Google, amenity, room type, room, booking, payment, discount, review, maintenance, role, dashboard, blog, chatbot và seasonal rate.
- `controller`: nhận request/response và gọi service/repository.
- `services`: logic nghiệp vụ theo domain (user, booking, room, payment, review, blog, discount, maintenance, seasonal, statistical, AI...).
- `repositories`: truy cập Prisma/Redis và các nguồn dữ liệu theo domain.
- `lib`: Prisma client, JWT middleware, Passport Google, permission, audit log, mailer, Pusher, bản đồ/thời tiết/AI và tiện ích ngày tháng.
- `schemas`, `enum`, `errors`, `helper`: schema request/domain, enum, lỗi và helper cookie/token.
- `prisma/schema.prisma`: schema MySQL; không thấy thư mục migration trong source được quét.

## Phụ thuộc và cấu hình

- Frontend scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `check` (typecheck + lint + build). Alias TypeScript `@/*` trỏ tới `src/*`; Next output `standalone`.
- Frontend thư viện chính: `next`, `react`, `axios`, `swr`, `zustand`, Radix UI, TipTap, UploadThing, face-api.js, Pusher, Leaflet, Recharts, QR/Excel/PDF-related UI helpers.
- Backend scripts: `start`, `dev/server`, `lint`, `build` (Prisma generate), `check` (lint + build).
- Backend thư viện chính: `express`, `@prisma/client`/`prisma`, `jsonwebtoken`, `bcryptjs`, `passport-google-oauth20`, `express-session`, `cookie-parser`, `cors`, PayOS, Cloudinary, Nodemailer, Redis/ioredis, Pusher, Socket.IO, OpenAI/Google GenAI/LangChain, Zod.
- Tên biến môi trường được source tham chiếu (không lưu giá trị): `PORT`, `FRONTEND_URL`, `BACKEND_URL`, `DATABASE_URL`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_URL_API`, `NEXT_PUBLIC_PUSHER_KEY`, `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`, `PAYOS_CLIENT_ID`, `OPENAI_API_KEY`, `API_KEY_AI`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_GGSHEETID`, `NEXT_PUBLIC_API_GGSHEET`, `GOOGLEMAP_API_KEY`, `UNSPLASH_ACCESS_KEY`, `EMAIL_USER`, `EMAIL_PASS` và một số biến Redis được tham chiếu trực tiếp trong code.

## Cơ sở dữ liệu và ORM

Prisma dùng MySQL (`DATABASE_URL`). Các model hiện có: `User`, `Customer`, `Guest`, `Employee`, `Role`, `EmployeeRole`, `RoomType`, `RoomTypeAmenity`, `Amenity`, `Room`, `RoomImage`, `Booking`, `BookingItem`, `Payment`, `Review`, `SeasonalRate`, `MaintenanceRecord`, `BlogPost`, `Discount`, `AuditLog`. Quan hệ chính bao phủ user/customer/employee, room/room type/amenity, booking/payment/review, seasonal rate, maintenance, blog và phân quyền nhân viên. Enum gồm user/room/booking/payment/department/maintenance statuses.

## Xác thực và phân quyền

- JWT được đọc từ `Authorization: Bearer ...` hoặc cookie `token`; refresh token dùng endpoint `/api/auth/refresh-token`.
- `authCustomer` xác thực user; `authEmployee` xác thực ADMIN/EMPLOYEE và nạp employee roles/permissions; `authAdmin` dành riêng ADMIN.
- Google OAuth dùng Passport (`/api/auth/google`, callback) rồi tạo JWT.
- Password/face login, đăng ký, đổi/quên/reset password, face descriptor và logout nằm trong user controller/routes.
- Backend permission middleware dùng `PERMISSIONS` và `checkPermission`; ADMIN được bypass trong `hasUserPermission`, các role khác lấy quyền từ `EmployeeRole.role.permissions`.
- Frontend lưu token trong Zustand/localStorage/cookie, axios interceptor tự gắn bearer và refresh khi 401; `src/proxy.ts` kiểm soát dashboard theo role `ADMIN`, `MANAGER`, `FRONT_DESK`, `MAINTENANCE`, `MARKETING`.
- Session Passport dùng `SESSION_SECRET`; cookie auth được cấu hình trong server/helper theo môi trường hiện tại.

## API và luồng dữ liệu

Backend mount: `/api/auth`, `/api/amenity`, `/api/roomtype`, `/api/room`, `/api/booking`, `/api/payment`, `/api/discount`, `/api/review`, `/api/maintenance`, `/api/role`, `/api/dashboard`, `/api/blog`, `/api/chatai`, `/api/seasonal`.

- Auth/user: signup/login, Google OAuth, customer/employee CRUD, guest, profile, password, face, refresh/logout, audit log.
- Room catalog: room type/amenity/room CRUD, images, availability/booked dates, customer search, calculate price, recommended/features.
- Booking/payment: customer hoặc employee tạo booking, xem/cập nhật/hủy, payment customer/employee và PayOS webhook.
- Operations: discount, seasonal rate, maintenance, review, role/permission, blog, dashboard statistics.
- AI/integration: chatbot, generate post, mini stats, voice parse/TTS; Pusher dùng thông báo booking dashboard; Redis, mailer, Google Maps/weather/Sheets/UploadThing và các dịch vụ thanh toán/media được gọi từ các module tương ứng.

Luồng tổng quát: trang/component frontend gọi `axiosInstance`/SWR tới `NEXT_PUBLIC_URL_API` → Express router → auth/permission middleware (khi có) → controller → service → repository/Prisma → MySQL; response cập nhật SWR/Zustand và UI. Một số server component gọi trực tiếp API bằng `axiosInstance`; thanh toán chuyển hướng qua PayOS và callback/webhook cập nhật trạng thái.

## Thành phần dùng chung và số lượng đã xác minh

- Backend: 16 API router, 16 controller, 18 service, 17 repository.
- Frontend: 40 route pages, 23 file trong `src/components`, 11 hook/store, 14 file `src/lib`.
- Providers toàn cục: `UserProvider`, `SidebarProvider`, `SWRProvider`, `Toaster`; dashboard dùng Pusher notification và `useAuth`.
- UI state chính: Zustand user/booking/chat/room type, SWR cache cho API, axios interceptor cho auth/refresh.

## Ghi chú đã biết / chưa xác minh runtime

- Chưa chạy lint/typecheck/build hoặc kết nối database trong ingestion; đây là bản đồ source tĩnh.
- `booking_Backend/repositories/redisClient.js` chứa cấu hình host/port Redis và tham chiếu một biến môi trường viết hoa/thường khác với nhóm biến REST; không thay đổi vì ngoài phạm vi ingestion.
- Một số endpoint được frontend tham chiếu nằm trong route hiện có nhưng có thể cần kiểm tra runtime riêng khi sửa tính năng; không suy đoán trạng thái triển khai.

## Nhật ký thay đổi

### 2026-09-21 — Ingestion dự án lần đầu

- Quét source/config thực tế, bỏ qua thư mục sinh tự động và dependencies.
- Tạo `PROJECT_MEMORY.md`.
- Ghi nhận kiến trúc frontend Next.js và backend Express/Prisma, schema MySQL, auth/authorization, API domains, services/repositories/hooks/utilities và luồng dữ liệu.
- Không sửa chức năng, không cài package, không thay đổi database.
- Kiểm tra đối chiếu lại tài liệu với các manifest, route, schema, auth middleware, providers và utility chính đã đọc.
- Chưa thực hiện kiểm tra runtime/lint/build trong lần ingestion.
