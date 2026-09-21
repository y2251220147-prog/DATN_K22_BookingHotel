# Tài liệu dự án quản lý và đặt phòng khách sạn

DATN K22 Booking • Phiên bản tài liệu 1.0 • Ngày 21 tháng 09 năm 2026

Dự án xây dựng website đặt phòng khách sạn và khu vực quản trị cho nhân viên. Khách hàng có thể tìm phòng, đặt phòng cho mình hoặc người khác, chọn thanh toán tiền mặt hoặc QR, quản lý hồ sơ và đánh giá. Nhân viên quản lý phòng, đơn đặt, khách hàng, giá theo mùa, bảo trì, bài viết và báo cáo. Hệ thống còn tích hợp chatbot, điều khiển bằng giọng nói và đăng nhập bằng khuôn mặt.

Tài liệu dành cho chủ dự án, người tiếp nhận mã nguồn và người chuẩn bị báo cáo đồ án. Các phần đầu giải thích chức năng và cách tổ chức hệ thống; các phần sau cung cấp dữ liệu, đường dẫn API, cấu hình, hướng dẫn chạy và các vấn đề cần hoàn thiện trước khi vận hành chính thức.

## 1 Tổng quan dự án

### 1.1 Mục tiêu và phạm vi

Mục tiêu là đưa hoạt động tìm phòng, đặt phòng và quản lý khách sạn lên một hệ thống chung. Giao diện khách hàng đóng vai trò quầy tiếp đón trực tuyến. Máy chủ xử lý nghiệp vụ giống bộ phận điều phối. MySQL là cuốn sổ lưu thông tin người dùng, phòng, đơn đặt và thanh toán.

Mã nguồn tổ chức thành hai ứng dụng độc lập, mỗi ứng dụng có `package.json`, `package-lock.json`, Dockerfile và kho Git riêng. Thư mục gốc chứa cả hai ứng dụng nhưng không phải một kho Git chung. Các thay đổi chưa commit trong từng ứng dụng là một phần của phiên bản đang được mô tả.

| Thành phần | Vai trò | Điểm bắt đầu |
| --- | --- | --- |
| booking_Frontend | Website khách hàng và trang quản trị | src/app/layout.tsx |
| booking_Backend | API và xử lý nghiệp vụ | server.js |
| MySQL | Lưu dữ liệu nghiệp vụ | prisma/schema.prisma |
| Redis Cloud | Bộ nhớ đệm phòng và bài viết | repositories/redisClient.js |
| Upstash Redis | Lịch sử hội thoại chatbot | services/openai.service.js |

### 1.2 Quy mô mã nguồn

Kiểm kê tại thời điểm lập tài liệu ghi nhận 109 tệp ở backend và 312 tệp ở frontend, tổng cộng 421 tệp ngoài thư viện cài đặt, dữ liệu Git và kết quả biên dịch. Con số này bao gồm mã nguồn, cấu hình, README, khóa phiên bản, tài nguyên ảnh và mô hình nhận diện. Trong đó có 352 tệp mang đuôi `.js`, `.ts`, `.tsx`, `.css` hoặc `.prisma`; frontend có 40 tệp `page.tsx`, backend có 20 mô hình Prisma.

Thư mục `node_modules`, `.next`, `.git` và tệp `tsconfig.tsbuildinfo` không được tính là mã nguồn nghiệp vụ. Các giá trị bí mật trong `.env` không đưa vào tài liệu.

### 1.3 Những điểm cần hiểu trước

- Cơ sở dữ liệu hỗ trợ nhiều phòng trong một đơn thông qua `BookingItem`, nhưng luồng tạo đơn hiện nhận một `roomId` và tạo một dòng phòng.
- Những phương thức thanh toán được khai báo trong cơ sở dữ liệu không đồng nghĩa đều có cổng thanh toán tương ứng. Luồng khách hàng hiện xử lý rõ `CASH` và `QR_CODE`.
- Có mã gọi dịch vụ gợi ý phòng và định giá bên ngoài, nhưng mã nguồn các dịch vụ đó không nằm trong hai ứng dụng này.
- Đường dẫn quản trị và API đã tồn tại không đồng nghĩa mọi đường dẫn đều được bảo vệ đồng nhất. Phần 13 nêu các trường hợp cụ thể.

## 2 Công nghệ và thư viện

Phiên bản dưới đây đọc từ tệp khóa và khai báo của chính dự án. Dấu `^` trong `package.json` là khoảng phiên bản được phép; `package-lock.json` ghi phiên bản cụ thể để cài đặt lại.

| Nhóm | Công nghệ | Phiên bản hoặc cấu hình tại dự án |
| --- | --- | --- |
| Môi trường chạy | Node.js và npm | Node từ 24; packageManager npm 11.6.2 |
| Giao diện | Next.js, React | Khóa Next 16.3.5; React 19.3.0 |
| Ngôn ngữ frontend | TypeScript | Khóa 5.9.3 |
| Kiểu dáng | Tailwind CSS, Radix UI | Tailwind nhánh 4; bộ thành phần trong src/components/ui |
| Trạng thái và dữ liệu | Zustand, SWR, Axios | Trạng thái đăng nhập, biểu mẫu và đồng bộ API |
| Máy chủ | Express | Khai báo ^5.1.0; khóa 5.2.1 |
| Cơ sở dữ liệu | MySQL và Prisma | Prisma 6.19.3; provider mysql |
| Xác thực | JWT, bcryptjs, Passport | Mật khẩu băm, access token, refresh token và Google OAuth |
| Kiểm tra đầu vào | Zod | Các schema trong booking_Backend/schemas |
| Thanh toán | @payos/node | Khai báo ^1.0.10 |
| Thông báo | Pusher và Nodemailer | Thông báo đơn mới; email đặt phòng và đặt lại mật khẩu |
| AI | LangChain và ModelAi | Adapter gọi dịch vụ tương thích Chat Completions |
| Khuôn mặt | face-api.js | Khai báo ^0.22.2; mô hình đặt ở public/models |
| Biên tập và báo cáo | Tiptap, Recharts, ExcelJS | Soạn blog, biểu đồ, xuất Excel |
| Tải ảnh | UploadThing | Endpoint Next.js /api/uploadthing |
| Bản đồ | Leaflet | Thành phần HotelMap và HotelMapWrapper |
| Triển khai | Docker, GitHub Actions | Hai Dockerfile; workflow triển khai backend lên VPS |

Một số thư viện như Socket.IO, Cloudinary và các SDK AI khác có trong danh sách phụ thuộc. Cần phân biệt việc cài thư viện với việc thư viện đã được nối vào luồng đang sử dụng; thông báo đơn mới được đọc thấy sử dụng Pusher.

## 3 Kiến trúc và cấu trúc thư mục

### 3.1 Luồng xử lý chung

Luồng dữ liệu chính đi từ trình duyệt đến Next.js, qua HTTP API tới Express, sau đó qua controller, service và repository để đọc hoặc ghi MySQL bằng Prisma. Kết quả quay lại giao diện dưới dạng JSON. Next.js cũng có các thành phần chạy phía máy chủ để lấy nội dung và dựng trang.

```text
Khách hàng hoặc nhân viên
        |
        v
Next.js trên cổng 3000
        |
        v
Express API trên cổng 5000
        |
        v
Route -> Controller -> Service -> Repository -> Prisma -> MySQL
                          |
                          +-> Redis và Upstash
                          +-> PayOS, Pusher, email và AI
```

Route xác định địa chỉ yêu cầu. Controller nhận dữ liệu, gọi kiểm tra đầu vào và trả mã HTTP. Service xử lý quy tắc nghiệp vụ. Repository thực hiện truy vấn. Cách chia này giúp người tiếp nhận biết nơi cần tìm khi thay đổi một chức năng.

### 3.2 Cấu trúc backend

```text
booking_Backend/
  api/             Khai báo các đường dẫn API
  controller/      Nhận yêu cầu và trả phản hồi
  services/        Quy tắc nghiệp vụ
  repositories/    Truy vấn dữ liệu và bộ nhớ đệm
  prisma/          Mô hình cơ sở dữ liệu
  schemas/         Kiểm tra dữ liệu bằng Zod
  middleware/      Danh sách quyền và bộ kiểm tra quyền
  lib/             Xác thực, email, AI, Pusher, nhật ký
  helper/          Thiết lập cookie xác thực
  enum/            Hằng trạng thái
  errors/          Lớp lỗi dùng chung
  .github/         Quy trình triển khai
  server.js        Khởi tạo Express và gắn router
```

`server.js` bật JSON parser, CORS, cookie parser, session và Passport. Danh sách CORS chứa địa chỉ phát triển, một số địa chỉ triển khai cố định và `FRONTEND_URL`. Backend nhận cổng từ `PORT`, mặc định 5000. `GET /` trả thông báo máy chủ đang chạy; đây chưa phải phép kiểm tra tình trạng MySQL và các dịch vụ phụ thuộc.

### 3.3 Cấu trúc frontend

```text
booking_Frontend/
  src/app/(client)/       Các trang khách hàng
  src/app/(dashboard)/    Trang quản trị và thành phần quản trị
  src/app/api/            Route chạy trên Next.js cho UploadThing
  src/components/        Thành phần dùng chung
  src/hook/              Hook và kho trạng thái Zustand
  src/lib/               Axios, vai trò, định dạng, Excel, khuôn mặt
  src/services/          Chuỗi gọi API nghiệp vụ
  src/utils/             Tiện ích UploadThing
  src/proxy.ts           Điều hướng theo token và vai trò
  public/image/          Ảnh và tài nguyên giao diện
  public/models/         Mô hình nhận diện khuôn mặt
  next.config.ts         Cấu hình Next.js và ảnh từ xa
```

Tên nhóm `(client)` và `(dashboard)` phục vụ tổ chức mã nguồn, không xuất hiện trong URL. Ví dụ `src/app/(dashboard)/admin/blog/page.tsx` tạo địa chỉ `/admin/blog`.

`next.config.ts` bật `reactStrictMode`, xuất bản dạng `standalone`, tắt header `X-Powered-By` và khai báo danh sách miền ảnh. Trang chủ có thời gian tái tạo nội dung 21.600 giây, tương đương 6 giờ. Các khối banner và nội dung trang chủ có dữ liệu dự phòng khi Google Sheets không sẵn sàng.

## 4 Người dùng và phân quyền

### 4.1 Loại tài khoản và vai trò

`User.userType` có ba giá trị `CUSTOMER`, `EMPLOYEE`, `ADMIN`. Vai trò nghiệp vụ của nhân viên được lưu riêng trong `Role`, nối qua `EmployeeRole`. Frontend sử dụng các tên `ADMIN`, `MANAGER`, `FRONT_DESK`, `MAINTENANCE`, `MARKETING`.

| Đối tượng | Công việc chính | Trang mặc định theo role |
| --- | --- | --- |
| Khách chưa đăng nhập | Xem phòng, bài viết, nội dung khách sạn | / |
| CUSTOMER | Đặt phòng, hồ sơ, lịch sử, đánh giá | / |
| ADMIN | Quản trị tổng thể | /admin |
| MANAGER | Quản lý kinh doanh và nhân sự | /admin |
| FRONT_DESK | Đặt phòng và tiếp nhận khách | /admin/bookings/listbooking |
| MAINTENANCE | Theo dõi bảo trì | /admin/rooms/maintenance |
| MARKETING | Bài viết và đánh giá | /admin/blog |

### 4.2 Cách kiểm tra quyền

Backend xác minh JWT bằng `jwt.verify`. `authCustomer` thực chất kiểm tra người dùng đã đăng nhập và tồn tại; các controller như tạo đặt phòng tiếp tục kiểm tra hồ sơ Customer. `authEmployee` kiểm tra loại tài khoản ADMIN hoặc EMPLOYEE và tải các vai trò từ cơ sở dữ liệu.

`hasUserPermission` cho phép `userType=ADMIN` vượt qua kiểm tra quyền chi tiết. Với nhân viên, hàm gộp các quyền trong tất cả vai trò rồi kiểm tra quyền yêu cầu. Ví dụ `BOOKING_CREATE`, `BOOKING_UPDATE`, `USER_READ` và `ROLE_MANAGE`.

Frontend đọc token để điều hướng và lọc menu. `src/proxy.ts` chọn quy tắc URL khớp dài nhất, sau đó đối chiếu role. Việc giải mã token ở frontend phục vụ trải nghiệm điều hướng; quyền truy cập dữ liệu vẫn phải được xác minh ở backend.

Một điểm chưa thống nhất là backend đăng nhập chỉ lấy role đầu tiên khi người dùng là EMPLOYEE, trong khi proxy đòi trường `role` hợp lệ, kể cả trường hợp tài khoản ADMIN. Cần kiểm thử tài khoản quản trị ban đầu trước khi bàn giao.

## 5 Chức năng khách hàng

### 5.1 Tra cứu và xem phòng

Khách nhập ngày đến, ngày đi, số người và loại phòng. Trang chi tiết hiển thị thông tin loại phòng, số phòng, ảnh, tiện nghi và biểu mẫu đặt. API cung cấp khoảng ngày đã đặt và giá tính cho khoảng lưu trú. Mã nguồn có chức năng gợi ý phòng dựa trên phòng người dùng đã xem hoặc danh sách phòng được đặt nhiều.

Nhóm tệp chính là `src/app/(client)/rooms`, các thành phần `SearchRoom`, `SearchForm`, `RoomTypeShowcase`, cùng `room.service.js` và `room.repo.js` của backend.

### 5.2 Đăng ký và đăng nhập

Người dùng đăng ký bằng thông tin cá nhân, email, mật khẩu và thông tin khách hàng. Mật khẩu được băm bằng bcrypt với tham số cost 10. Hệ thống kiểm tra email và số giấy tờ đã tồn tại. Đăng nhập có tùy chọn ghi nhớ, đăng nhập Google và đăng nhập khuôn mặt.

Access token của đăng nhập mật khẩu có hạn 15 phút hoặc 20 phút khi chọn ghi nhớ; refresh token có hạn 7 ngày. Frontend lưu thông tin đăng nhập trong Zustand và đồng bộ token vào localStorage/cookie. Axios có hàng đợi để hạn chế nhiều yêu cầu làm mới token chạy đồng thời khi gặp lỗi 401.

Đặt lại mật khẩu được thực hiện qua liên kết trong email. Token khôi phục hiện được ký bằng cùng `JWT_SECRET` với access token và có hạn 15 phút; cần tách mục đích token và kiểm soát sử dụng một lần khi hoàn thiện bảo mật.

### 5.3 Đặt phòng và đặt hộ

Sau khi chọn ngày và phòng, người dùng kiểm tra thông tin, áp mã giảm giá nếu có và chọn phương thức thanh toán. Với đặt hộ, frontend tạo bản ghi Guest trước rồi gửi `guestId` khi tạo Booking. Người đứng tên tài khoản vẫn được lưu bằng `customerId`.

Đơn mới có trạng thái `PENDING`. Giao diện gọi API thanh toán sau khi tạo đơn. Hai bước này tách rời: nếu thanh toán hoặc dịch vụ phụ trợ lỗi, cần kiểm tra đơn đã được tạo hay chưa trước khi thử lại.

### 5.4 Hồ sơ và đánh giá

Khách có thể sửa thông tin, đổi mật khẩu, quản lý dữ liệu khuôn mặt, xem lịch sử đặt phòng, gửi yêu cầu hủy và đánh giá. Review lưu điểm từ 1 đến 5 cùng nội dung nhận xét, liên kết tới Booking và Customer.

Giao diện có bước hỏi API một đơn đã được đánh giá hay chưa. Cơ sở dữ liệu chưa có ràng buộc duy nhất cho cặp `bookingId` và `customerId`; cần bổ sung kiểm tra quyền sở hữu, điều kiện hoàn tất lưu trú và chống đánh giá lặp ở máy chủ.

### 5.5 Nội dung và hỗ trợ

Trang chủ, giới thiệu và thư viện ảnh sử dụng ảnh cục bộ kết hợp nội dung Google Sheets. Blog công khai truy vấn các bài đã xuất bản. Website có chatbot AI và widget Tawk.to; widget hỗ trợ được tải sau khoảng 5 giây tại trang chủ. Bản đồ khách sạn dùng Leaflet.

## 6 Chức năng quản trị

| Phân hệ | Thao tác có trong mã nguồn |
| --- | --- |
| Dashboard | Tổng số đơn, khách hàng, doanh thu, biểu đồ tháng và top phòng |
| Đặt phòng | Lọc danh sách, tạo tại quầy, nhận phòng, trả phòng, hủy và xóa |
| Hóa đơn | Hiển thị thông tin đặt phòng và in qua react-to-print |
| Phòng | Thêm, sửa, xóa, quản lý ảnh, lọc trạng thái và loại phòng |
| Loại phòng | Quản lý mô tả, sức chứa, ảnh và tiện nghi |
| Tiện nghi | Thêm, sửa, xóa các tiện nghi dùng chung |
| Khách hàng | Tìm kiếm, phân trang và thay đổi trạng thái tài khoản |
| Nhân viên | Tạo, cập nhật, xóa, thay đổi trạng thái và gán vai trò |
| Vai trò | Tạo nhóm quyền, gán hoặc gỡ khỏi nhân viên, xóa vai trò |
| Giảm giá | Quản lý mã, tỷ lệ và khoảng hiệu lực |
| Giá theo mùa | Tạo lịch theo phòng, hệ số giá, bật tắt và chỉnh sửa |
| Bảo trì | Ghi nhận công việc, chi phí, trạng thái và ngày hoàn thành |
| Blog | Soạn bài, tạo nháp AI, xem trước, xuất bản và gỡ xuất bản |
| Đánh giá | Xem và xóa đánh giá |
| Nhật ký | Tra cứu các sự kiện đặt phòng, nhận trả phòng và thanh toán |
| Thống kê AI | Hỏi dữ liệu bằng ngôn ngữ tự nhiên và hiển thị kết quả |

Danh mục quyền chi tiết trong `middleware/permission.js` rộng hơn số nơi đã áp dụng kiểm tra quyền. Khi thêm một nút trên giao diện cần kiểm tra cả API tương ứng, không chỉ quy tắc hiện hoặc ẩn nút.

## 7 Quy trình nghiệp vụ

### 7.1 Tạo đặt phòng trên website

1. Khách chọn phòng, khoảng ngày, số người và mã giảm giá.
2. Frontend lấy giá qua `/api/room/calculate-price`, lấy ngày đã đặt và lưu biểu mẫu vào Zustand.
3. Khách đăng nhập; nếu đặt hộ thì frontend tạo Guest qua `/api/auth/guest`.
4. `POST /api/booking` xác minh người dùng, kiểm tra BookingSchema và lấy `customerId` từ phiên đăng nhập.
5. Service kiểm tra lịch trùng theo người đặt hoặc khách được đặt hộ; repository tạo Booking và BookingItem.
6. Backend gọi Pusher, gửi email và ghi AuditLog.
7. Frontend gọi `/api/payment`. Tiền mặt được ghi nhận, còn QR nhận URL chuyển sang PayOS.
8. Khách xem kết quả ở `/profile/bookings`.

Kiểm tra lịch trong bước 5 hiện dựa trên khách hàng hoặc Guest. Chưa có kiểm tra khóa phòng đủ chặt theo `roomId` ngay trong thao tác tạo đơn để ngăn hai người khác nhau đặt cùng một phòng đồng thời. Đây là điểm cần ưu tiên trước khi dùng thật.

### 7.2 Tạo đặt phòng tại quầy

Nhân viên tìm khách theo giấy tờ hoặc tạo khách hàng mới, chọn phòng, nhập thông tin đặt rồi ghi nhận thanh toán. Chuỗi gọi API được tổ chức trong `src/services/ApiService.ts`: tạo khách nếu cần, tạo booking nhân viên, sau đó tạo payment với trạng thái `COMPLETED`.

Trong controller hiện tại, việc kiểm tra `BOOKING_CREATE` xảy ra sau khi gọi service tạo đơn. Cần chuyển kiểm tra quyền lên trước thao tác ghi dữ liệu để phản hồi từ chối thực sự ngăn được tạo đơn.

### 7.3 Nhận phòng và trả phòng

Luồng chuyển trạng thái đang được cài đặt trong `confirmStatusRepo`:

```text
PENDING -> CHECKED_IN -> CHECKED_OUT
            |                 |
       Room OCCUPIED      Room AVAILABLE
```

Cả hai bước chuyển đều cập nhật các payment của đơn thành `COMPLETED`. `CONFIRMED` và `NO_SHOW` có trong enum nhưng không nằm trong luồng chuyển trạng thái này. Vì vậy cần tách rõ xác nhận thu tiền với xác nhận nhận phòng khi hoàn thiện quy trình.

### 7.4 Hủy và xóa đơn

Khách gọi `DELETE /api/booking/:id` nhưng backend hiện chuyển trạng thái đơn sang `CANCELLED`, payment sang `FAILED` và phòng về `AVAILABLE`; đó là hủy logic, không xóa bản ghi. Nhân viên gọi `PUT /api/booking/cancelled/:id` thì payment được đặt thành `REFUNDED`. Mã nguồn này chỉ đổi trạng thái dữ liệu, chưa thể hiện thao tác hoàn tiền thực tế qua PayOS.

`DELETE /api/booking/employee/:id` xóa các BookingItem, Payment rồi xóa Booking. Nếu đơn còn Review liên quan, ràng buộc dữ liệu có thể ngăn xóa. Việc giữ lịch sử và sử dụng hủy logic thường phù hợp hơn với dữ liệu kinh doanh.

### 7.5 Tính giá và giá theo mùa

API tính giá duyệt từng ngày từ ngày nhận đến trước ngày trả. Ngày nằm trong một khoảng mùa sử dụng `Room.currentPrice`; ngày ngoài mùa dùng `Room.originalPrice`. API trả `total`, `currentPrice`, `originalPrice` và `displayPrice`.

Khi tạo mùa, repository tính `originalPrice × multiplier` và cập nhật ngay `currentPrice`, dù bản ghi mùa được tạo với `isActive=false`. Hai tác vụ định kỳ chạy lúc 00 giờ theo `Asia/Ho_Chi_Minh` để kích hoạt mùa và xử lý mùa hết hạn. Bật hoặc tắt thủ công cũng thay đổi giá hiện tại của phòng.

Cách lưu một `currentPrice` chung khiến nhiều mùa có hệ số khác nhau dễ làm giá một khoảng đặt không khớp mong muốn. Khi nâng cấp, nên tính giá từng đêm bằng hệ số của mùa áp dụng cho chính đêm đó, đồng thời thống nhất quy tắc ngày cuối mùa và múi giờ.

### 7.6 Thanh toán QR

Backend tạo `orderCode`, gọi PayOS tạo liên kết và lưu mã đó vào `Payment.transactionId`. Khi nhận `PAID`, repository đổi payment thành `COMPLETED`. Khi nhận `CANCELLED`, repository đặt payment thành `FAILED` và booking thành `CANCELLED`.

Hai trang kết quả của frontend lấy `status` và `orderCode` từ URL rồi gửi tới `/api/payment/webhook/payos`. Controller hiện nhận trực tiếp hai trường này và chưa xác minh chữ ký webhook. Vì vậy trang kết quả hiện chưa đủ để làm bằng chứng đã thu tiền; cần đối soát từ PayOS ở máy chủ trước khi xác nhận giao dịch.

### 7.7 Bảo trì

Tạo MaintenanceRecord đồng thời đổi Room sang `MAINTENANCE`. Hoàn tất công việc ghi ngày kết thúc và trả phòng về `AVAILABLE`. Xóa bản ghi bảo trì cũng trả phòng về `AVAILABLE`. Cần kiểm tra xung đột với lưu trú hoặc công việc bảo trì khác trước khi cập nhật trạng thái phòng.

## 8 Mô hình cơ sở dữ liệu

Nguồn chuẩn là `booking_Backend/prisma/schema.prisma`. Khóa chính của các mô hình là chuỗi UUID. Tiền đặt phòng và thanh toán dùng `Decimal(10,2)`; hệ số mùa và phần trăm giảm giá dùng `Decimal(5,2)`.

### 8.1 Các nhóm dữ liệu

| Mô hình | Trường tiêu biểu | Vai trò và quan hệ |
| --- | --- | --- |
| User | email, password, userType, status, faceDescriptor | Tài khoản; email duy nhất; có Customer hoặc Employee |
| Customer | userId, address, city, country, idNumber | Hồ sơ khách; userId duy nhất; có nhiều Booking và Review |
| Guest | fullName, idNumber, phone, email | Người được đặt hộ; một Guest có nhiều Booking |
| Employee | userId, position, department, hireDate | Nhân viên; có vai trò và bài viết |
| Role | name, permissions | Tên vai trò duy nhất; permissions là JSON |
| EmployeeRole | employeeId, roleId | Bảng nối nhân viên với vai trò; cặp khóa duy nhất |
| RoomType | name, description, maxOccupancy, photoUrls | Loại phòng; tên duy nhất; có nhiều phòng |
| Amenity | name, description | Danh mục tiện nghi; tên duy nhất |
| RoomTypeAmenity | roomTypeId, amenityId | Bảng nối loại phòng với tiện nghi; cặp khóa duy nhất |
| Room | roomNumber, floor, status, originalPrice, currentPrice | Phòng cụ thể; số phòng duy nhất; thuộc một loại |
| RoomImage | imageUrl, roomId | Một phòng có nhiều ảnh |
| Booking | checkInDate, checkOutDate, totalGuests, totalAmount | Đơn đặt; thuộc Customer, có thể gắn Guest và Discount |
| BookingItem | bookingId, roomId, pricePerNight | Phòng trong đơn; cặp bookingId và roomId duy nhất |
| Payment | bookingId, amount, paymentMethod, status, transactionId | Một đơn có nhiều lần thanh toán |
| Review | customerId, bookingId, rating, comment | Nhận xét gắn khách hàng và đơn |
| Discount | code, percentage, validFrom, validTo | Mã giảm giá duy nhất; áp dụng cho nhiều đơn |
| SeasonalRate | roomId, startDate, endDate, multiplier, isActive | Các khoảng giá mùa của phòng |
| MaintenanceRecord | roomId, description, status, cost | Lịch bảo trì và chi phí |
| BlogPost | title, slug, summary, content, published | Bài viết thuộc Employee; slug duy nhất |
| AuditLog | action, entity, entityId, userId, details | Nhật ký thao tác; userId là trường chuỗi, không khai báo quan hệ Prisma |

### 8.2 Quan hệ chính

```text
User -> Customer -> Booking -> BookingItem -> Room -> RoomType
          |           |                       |          |
          +-> Review <-+                       |          +-> RoomTypeAmenity -> Amenity
                      +-> Payment             +-> RoomImage
Guest --------------> Booking                 +-> SeasonalRate
Discount -----------> Booking                 +-> MaintenanceRecord

User -> Employee -> EmployeeRole -> Role
             +-> BlogPost

AuditLog lưu dấu vết các sự kiện nghiệp vụ
```

Quan hệ một tài khoản với Customer hoặc Employee là tùy chọn ở tầng schema; ứng dụng quyết định loại hồ sơ dựa trên `userType`. Booking bắt buộc có Customer, dù có Guest. Thiết kế này giữ được người tạo đơn khi đặt hộ.

### 8.3 Giá trị trạng thái

| Trường enum | Các giá trị |
| --- | --- |
| UserType | CUSTOMER, EMPLOYEE, ADMIN |
| UserStatus | ACTIVE, INACTIVE, SUSPENDED |
| RoomStatus | AVAILABLE, OCCUPIED, MAINTENANCE |
| BookingStatus | PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW |
| BookingSource | DIRECT, WEBSITE, PHONE, EMAIL, TRAVEL_AGENT, BOOKING_PLATFORM |
| PaymentStatus | PENDING, COMPLETED, FAILED, REFUNDED |
| PaymentMethod | CASH, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER, PAYPAL, MOBILE_PAYMENT, QR_CODE |
| Department | FRONT_DESK, MAINTENANCE, MANAGEMENT |
| MaintenanceStatus | SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |

### 8.4 Ràng buộc và dữ liệu khởi tạo

Schema có chỉ mục phục vụ tìm đơn theo trạng thái, ngày nhận, ngày trả, ngày đặt và khách hàng. Các bảng nối có ràng buộc duy nhất để tránh gán cùng tiện nghi hoặc vai trò hai lần. Một số quan hệ xóa dây chuyền như ảnh phòng và bảng nối; các quan hệ nghiệp vụ còn lại có thể chặn thao tác xóa khi vẫn có bản ghi tham chiếu.

Trong thư mục Prisma hiện có schema, chưa có bộ migration hoặc script seed đi kèm. Việc tạo môi trường mới phải chuẩn bị lược đồ, tài khoản quản trị đầu tiên và dữ liệu danh mục. Không có mật khẩu quản trị mặc định được tài liệu này quy định.

## 9 Danh mục màn hình

### 9.1 Khu vực khách hàng

| Đường dẫn | Nội dung |
| --- | --- |
| / | Trang chủ và tìm phòng |
| /about | Giới thiệu khách sạn |
| /gallery | Thư viện ảnh |
| /rooms/[id] | Danh sách phòng của một loại |
| /rooms/[id]/[roomId] | Chi tiết phòng và đặt phòng |
| /blog | Danh sách bài viết |
| /blog/[slug] | Chi tiết bài viết |
| /signUp | Đăng ký |
| /signIn | Đăng nhập |
| /forgot-password | Yêu cầu email đặt lại mật khẩu |
| /forgot-password/reset-password | Đổi mật khẩu bằng token |
| /auth/google/callback | Nhận kết quả đăng nhập Google |
| /profile | Hồ sơ cá nhân |
| /profile/bookings | Lịch sử đặt phòng |
| /profile/change-password | Mật khẩu và quản lý khuôn mặt |
| /profile/reviews | Các đánh giá của khách |
| /payment/success | Trang kết quả thanh toán thành công |
| /payment/cancel | Trang kết quả thanh toán bị hủy |
| /test | Trang thử nghiệm |

### 9.2 Khu vực quản trị

| Đường dẫn | Nội dung |
| --- | --- |
| /admin | Dashboard tổng quan |
| /admin/bookings/listbooking | Danh sách và xử lý đơn |
| /admin/bookings/add-booking | Tạo đơn tại quầy |
| /admin/rooms/room | Quản lý phòng |
| /admin/rooms/room-types | Quản lý loại phòng |
| /admin/rooms/amenities | Quản lý tiện nghi |
| /admin/rooms/maintenance | Bảo trì phòng |
| /admin/maintenance | Một trang bảo trì khác còn trong mã nguồn |
| /admin/users/customers | Khách hàng |
| /admin/users/employees | Nhân viên |
| /admin/users/roles | Vai trò và quyền |
| /admin/discounts | Mã giảm giá |
| /admin/seasonal-rates | Danh sách mùa giá |
| /admin/seasonal-rates/add | Thêm mùa giá |
| /admin/blog | Quản lý bài viết |
| /admin/blog/add | Soạn và tạo bài viết |
| /admin/reviews | Quản lý đánh giá |
| /admin/reviews/audit-logs | Nhật ký thao tác |
| /admin/statiscal | Thống kê mở rộng |
| /admin/profile | Hồ sơ nhân viên |
| /admin/unauthorized | Thông báo thiếu quyền |

Tên đường dẫn `/admin/statiscal` giữ nguyên theo mã nguồn. Không tự đổi thành `/admin/statistical` khi nhập địa chỉ.

## 10 Danh mục API

### 10.1 Quy ước đọc

Địa chỉ backend khi chạy mặc định là `http://localhost:5000`. Tất cả đường dẫn dưới đây tính từ địa chỉ này, trừ UploadThing chạy trên frontend. `:id` và `:slug` là tham số cần thay bằng giá trị thật. GET dùng để đọc, POST để tạo hoặc thực hiện thao tác, PUT để cập nhật, DELETE để xóa hoặc hủy theo cách controller định nghĩa.

Phản hồi chưa dùng một cấu trúc thống nhất: có API trả `data`, có API trả `room`, `customer`, mảng trực tiếp hoặc đối tượng phân trang. Khi viết bên tích hợp cần đọc đúng controller, không giả định mọi kết quả đều nằm trong `response.data.data`.

Ký hiệu trong bảng: `Mở` nghĩa là route không gắn middleware xác thực; `ĐN` là `authCustomer`; `NV` là `authEmployee`. Một route `Mở` vẫn có thể kiểm tra dữ liệu đầu vào. Ký hiệu mô tả cơ chế hiện có, không khẳng định đó là mức bảo vệ phù hợp.

### 10.2 Tài khoản và xác thực

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| POST | /api/auth/signUp | Đăng ký; Mở |
| POST | /api/auth/login | Đăng nhập mật khẩu; Mở |
| POST | /api/auth/login/face | Đăng nhập khuôn mặt; Mở |
| POST | /api/auth/login/face/descriptor | Lấy descriptor theo email; Mở |
| POST | /api/auth/refresh-token | Làm mới access token bằng cookie refreshToken |
| GET | /api/auth/logOut | Xóa cookie đăng nhập |
| GET | /api/auth/user | Hồ sơ tài khoản; ĐN |
| GET | /api/auth/customer | Danh sách khách; Mở |
| PUT | /api/auth/customer/:id | Cập nhật hồ sơ; Mở |
| POST | /api/auth/createCustomer | Tạo khách tại quầy; NV và CUSTOMER_CREATE |
| POST | /api/auth/guest | Tạo người được đặt hộ; ĐN |
| POST | /api/auth/user/changePassword | Đổi mật khẩu; ĐN |
| POST | /api/auth/forgot-password | Gửi email khôi phục; Mở |
| POST | /api/auth/reset-password | Đặt lại mật khẩu bằng token; Mở |
| PUT | /api/auth/disabled/:id | Thay đổi trạng thái khách; NV và CUSTOMER_UPDATE |
| PUT | /api/auth/face-descriptor | Cập nhật descriptor 128 phần tử; ĐN |
| DELETE | /api/auth/face-descriptor | Xóa descriptor; ĐN |
| GET | /api/auth/face-descriptor/status | Kiểm tra đã đăng ký khuôn mặt; ĐN |
| GET | /api/auth/google | Bắt đầu Google OAuth |
| GET | /api/auth/google/callback | Callback Google OAuth |
| GET | /api/auth/auditlog | Nhật ký; NV |

`/api/auth/reset-password` được đăng ký lặp hai lần trong `user.route.js`; bảng chỉ liệt kê một lần vì cùng phương thức và đường dẫn.

### 10.3 Nhân viên và vai trò

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| POST | /api/auth/employee | Tạo nhân viên; NV và USER_CREATE |
| GET | /api/auth/employee | Danh sách nhân viên; NV và USER_READ |
| PUT | /api/auth/employee/:id | Cập nhật; NV và USER_UPDATE |
| PUT | /api/auth/employee/disabled/:id | Trạng thái nhân viên; NV và USER_UPDATE |
| DELETE | /api/auth/employee/:id | Xóa nhân viên; NV và USER_DELETE |
| POST | /api/role | Tạo vai trò; NV |
| GET | /api/role | Danh sách vai trò; NV và ROLE_MANAGE |
| POST | /api/role/roleEmployee | Gán vai trò; NV và ROLE_MANAGE |
| DELETE | /api/role/:id | Xóa vai trò; NV và ROLE_MANAGE |
| DELETE | /api/role/removeRole/:id | Gỡ bản ghi gán vai trò; NV và ROLE_MANAGE |

### 10.4 Phòng và danh mục

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| GET | /api/room | Danh sách quản trị; NV |
| POST | /api/room | Tạo phòng; Mở |
| GET | /api/room/customer | Tìm phòng khách hàng; Mở |
| GET | /api/room/calculate-price | Tính giá theo ngày; Mở |
| GET | /api/room/:id | Chi tiết phòng; Mở |
| PUT | /api/room/:id | Cập nhật phòng; Mở |
| DELETE | /api/room/:id | Xóa phòng; Mở |
| POST | /api/room/images/:id | Thêm ảnh cho phòng; Mở |
| DELETE | /api/room/images/:id | Xóa ảnh theo ID ảnh; Mở |
| GET | /api/room/roomtype/:id | Phòng theo loại; Mở |
| GET | /api/room/:id/booked-dates | Khoảng ngày đã đặt; Mở |
| POST | /api/room/recommended | Gợi ý phòng; Mở |
| GET | /api/room/ai/features | Đặc trưng phòng cho dịch vụ gợi ý; Mở |
| GET, POST | /api/roomtype | Danh sách hoặc tạo loại phòng; Mở |
| GET | /api/roomtype/dropdown/list | Danh sách chọn loại phòng; Mở |
| GET, PUT, DELETE | /api/roomtype/:id | Đọc, sửa, xóa loại phòng; Mở |
| POST, DELETE | /api/roomtype/:id/amenities | Gắn hoặc gỡ tiện nghi; Mở |
| GET, POST | /api/amenity | Danh sách hoặc tạo tiện nghi; Mở |
| PUT, DELETE | /api/amenity/:id | Sửa hoặc xóa tiện nghi; Mở |

Các bộ lọc phòng gồm `checkIn`, `checkOut`, `customer`, `roomType`; danh sách quản trị có thêm `status`, `search`, `page`, `limit`. Tính giá nhận `bookingStart`, `bookingEnd`, `roomId`. Gợi ý phòng nhận body có `roomIds` là mảng ID.

### 10.5 Đặt phòng và thanh toán

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| POST | /api/booking | Khách tạo đơn; ĐN và hồ sơ Customer |
| GET | /api/booking | Danh sách đơn; Mở |
| POST | /api/booking/employee | Nhân viên tạo đơn; NV; BOOKING_CREATE kiểm tra sau tạo |
| GET | /api/booking/bookingUser | Lịch sử khách hiện tại; ĐN |
| PUT | /api/booking/:id | Chuyển trạng thái nhận hoặc trả phòng; NV và BOOKING_UPDATE |
| PUT | /api/booking/cancelled/:id | Nhân viên hủy; NV và BOOKING_UPDATE |
| DELETE | /api/booking/:id | Khách hủy logic đơn; ĐN |
| DELETE | /api/booking/employee/:id | Nhân viên xóa đơn; NV và BOOKING_DELETE |
| POST | /api/payment | Ghi tiền mặt hoặc tạo liên kết QR; Mở |
| POST | /api/payment/employee | Ghi thanh toán tại quầy; Mở |
| POST | /api/payment/webhook/payos | Cập nhật theo orderCode và status; Mở |

Body tạo đơn khách hàng gồm `checkInDate`, `checkOutDate`, `totalGuests`, `bookingSource`, `totalAmount`, `pricePerNight`, `roomId`, tùy chọn `specialRequests`, `discountId`, `guestId`. `customerId` được lấy từ người dùng đã xác thực.

Body thanh toán gồm `amount`, `paymentMethod`, `bookingId`, `status`. QR có thể trả `{status: "redirect", url: ...}`. Giá trị tiền và trạng thái do phía gọi gửi lên hiện cần được xác nhận lại bằng dữ liệu máy chủ để tránh sai lệch.

### 10.6 Giá mùa giảm giá bảo trì và đánh giá

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| GET | /api/seasonal | Danh sách mùa giá; Mở |
| POST | /api/seasonal | Tạo mùa giá; NV |
| PUT, DELETE | /api/seasonal/:id | Cập nhật hoặc xóa; NV |
| GET | /api/discount | Tra mã theo query code; Mở |
| GET | /api/discount/getAll | Danh sách mã; NV |
| POST | /api/discount | Tạo mã; NV |
| PUT, DELETE | /api/discount/:id | Sửa hoặc xóa mã; NV |
| GET, POST | /api/maintenance | Xem hoặc tạo bảo trì; NV |
| PUT | /api/maintenance/:id | Cập nhật bảo trì; NV |
| DELETE | /api/maintenance/:id | Xóa bảo trì; Mở |
| POST | /api/review | Tạo đánh giá; ĐN |
| GET | /api/review | Đánh giá của khách đang đăng nhập; ĐN |
| GET | /api/review/status | Kiểm tra đánh giá theo bookingId; ĐN |
| GET | /api/review/all | Danh sách đánh giá; Mở |
| DELETE | /api/review/:id | Xóa đánh giá; NV |

Các controller trong nhóm này có thể bổ sung kiểm tra quyền chi tiết. Cần đọc cả route và controller khi thay đổi quyền; bảng mô tả middleware gắn ở route.

### 10.7 Blog thống kê và AI

| Phương thức | Đường dẫn | Chức năng và bảo vệ |
| --- | --- | --- |
| GET | /api/blog | Danh sách bài đã xuất bản; Mở |
| GET | /api/blog/employee | Danh sách quản trị, có thể gồm bản nháp; Mở |
| GET | /api/blog/:slug | Bài viết công khai theo slug; Mở |
| POST | /api/blog | Tạo bài; NV và cần hồ sơ Employee |
| PUT | /api/blog/:id | Đảo trạng thái xuất bản; NV |
| PUT | /api/blog/update/:id | Cập nhật nội dung; NV |
| DELETE | /api/blog/:id | Xóa bài; Mở |
| GET | /api/dashboard | Tổng quan theo range; Mở |
| GET | /api/dashboard/revenue-total-month | Doanh thu tháng theo year; Mở |
| GET | /api/dashboard/customer-count-by-month | Khách hàng mới từng tháng; Mở |
| GET | /api/dashboard/revenue-online-offline | Số đơn WEBSITE và DIRECT; Mở |
| GET | /api/dashboard/top-rooms | Top phòng và loại phòng theo period; Mở |
| POST | /api/chatai | Chat hoặc lấy lịch sử khi message rỗng; Mở |
| POST | /api/chatai/generate-post | Tạo bản nháp theo topic; Mở |
| POST | /api/chatai/test | Nhánh thử nghiệm hội thoại; Mở |
| POST | /api/chatai/mini-stats | Hỏi thống kê theo message; Mở |
| POST | /api/chatai/voice/parse | Phân tích prompt giọng nói; Mở |
| GET | /api/chatai/tts | Âm thanh tiếng Việt theo query text; Mở |

UploadThing nằm tại frontend: `GET` và `POST /api/uploadthing`. Bộ định tuyến `imageUploader` cho tối đa 10 ảnh, mỗi ảnh tối đa 4 MB. Handler hiện chưa gắn bước xác thực người tải trong cấu hình được đọc.

## 11 Tích hợp AI và dịch vụ ngoài

### 11.1 Chatbot khách hàng

`OpenAIService` nhận nội dung và `sessionId`, xác định ý định bằng từ khóa rồi truy vấn dữ liệu phù hợp: phòng, loại phòng, thông tin khách sạn, thời tiết hoặc địa điểm gần khách sạn. Ngữ cảnh được ghép vào prompt trước khi gọi ModelAi. Lịch sử chat dùng Upstash Redis với TTL 600 giây.

Adapter chính `lib/ApiKeyModel.js` gửi yêu cầu tới dịch vụ tại `gpt4.shupremium.com`, với chuỗi model `gpt-4o-mini` trong body và khóa `API_KEY_AI`. Đây là cấu hình trong mã, không phải bằng chứng về nhà cung cấp hạ tầng thực sự phía sau dịch vụ trung gian.

`lastIntent` và `lastContext` hiện là biến chung ở cấp module. Do không gắn theo `sessionId`, hai hội thoại đồng thời có nguy cơ dùng lẫn ngữ cảnh; cần chuyển chúng thành trạng thái theo phiên.

### 11.2 Tạo bản nháp blog

Luồng `generatePostService` dùng `lib/blog-draft.js` để tạo nội dung có cấu trúc. Chủ đề phải là chuỗi từ 1 đến 5.000 ký tự. Nội dung gồm tiêu đề, tóm tắt, mở đầu, 6 đến 10 mục, ít nhất 3 câu hỏi thường gặp và kết luận.

Hàm kiểm tra đặt mục tiêu tối thiểu 1.200 từ theo cách đếm khoảng trắng. Nếu chưa hợp lệ, luồng cho một lần sửa hoặc viết lại. Sau lần cuối, một bản đủ cấu trúc và từ 600 từ có thể được giữ lại cùng cảnh báo độ dài. JSON hỏng được đưa lại vào ngữ cảnh để thử sửa, không lặp vô hạn.

Ảnh được tìm qua Unsplash. Bộ chọn chỉ nhận ảnh trong danh sách ứng viên, điểm từ 85 đến 100, tối đa 3 ảnh và không trùng mục. URL được giới hạn theo miền cho phép; văn bản được escape khi dựng HTML. Nếu không chọn được ảnh thì nội dung vẫn được giữ, ảnh bìa để trống và trả cảnh báo cho người biên tập. Bản nháp cần được người viết kiểm tra trước khi xuất bản.

### 11.3 Thống kê bằng hội thoại

`generateMiniStatsService` phân tích câu hỏi và gọi các truy vấn trong `MiniStatsRepo`. Mã có xử lý thống kê theo thời gian, phòng, người dùng và doanh thu, cùng dữ liệu bảng hoặc biểu đồ để frontend trình bày. Đây là nhánh có thể truy cập thông tin quản trị, trong khi route chưa gắn xác thực; cần bổ sung quyền trước khi đưa ra mạng công khai.

### 11.4 Giọng nói

Frontend dùng `useVoiceAssistant` và prompt trong `src/lib/voice-prompts.ts` để chuyển lời nói thành yêu cầu. Backend phân tích ý định như điều hướng, xem phòng, tìm theo loại hoặc tiêu chí, đọc bài viết. Âm thanh trả lời được lấy qua `/api/chatai/tts`; service chia văn bản thành đoạn tối đa khoảng 200 ký tự và gọi endpoint đọc tiếng Việt của Google Translate.

Khả năng nhận giọng nói phụ thuộc trình duyệt và quyền microphone. Đăng nhập khuôn mặt cần camera và các model trong `/models`. Đây là hai luồng khác nhau dù đều là chức năng hỗ trợ thông minh.

### 11.5 Nhận diện khuôn mặt

`face-api.js` tải SSD Mobilenet, landmark 68 điểm và face recognition model. Descriptor là mảng 128 phần tử được lưu dưới dạng chuỗi JSON trong `User.faceDescriptor`. Backend so sánh khoảng cách Euclid với ngưỡng mặc định 0,5.

API lấy descriptor theo email hiện công khai. Cần bảo vệ dữ liệu này, tăng kiểm tra đầu vào và thiết kế chống giả mạo phía máy chủ; kiểm tra camera hoặc chuyển động ở giao diện không đủ để bảo vệ một API nhận trực tiếp descriptor từ phía gọi.

### 11.6 Gợi ý phòng và định giá ngoài

`getRecommendedRoomsService` gọi `http://localhost:8000/recommend`. Khi không nhận được kết quả phù hợp hoặc có lỗi, service chuyển sang repository: nếu có ID thì lấy theo ID, nếu không có thì lấy 3 phòng theo số BookingItem giảm dần.

`PricingDashboard.tsx` gọi dịch vụ định giá tại `http://127.0.0.1:8000/api/price`. Vì đây là thành phần chạy phía trình duyệt, địa chỉ này trỏ vào máy của người truy cập. Cần cấu hình URL dịch vụ phù hợp khi triển khai; không xem việc giao diện có thành phần định giá là bằng chứng dịch vụ tính giá đã được triển khai cùng backend.

### 11.7 Nội dung thông báo và bộ nhớ đệm

Pusher phát sự kiện `new-booking` trên `admin-channel`. Frontend `AdminNotifications` nhận thông báo và có thể đọc thông báo thành tiếng. Nodemailer gửi email đặt phòng và liên kết khôi phục mật khẩu.

Redis Cloud lưu dữ liệu phòng theo loại và blog theo slug khoảng 3.600 giây. Mã cập nhật hiện chưa thể hiện đầy đủ việc xóa cache tương ứng, nên nội dung có thể chưa đổi ngay sau chỉnh sửa. Upstash là kết nối khác, dành cho lịch sử chatbot.

Google Sheets cung cấp nội dung các vùng như `bannerHome!A2:C3`, `Bean!A2:B6`, `Bean!C2:C8`, `Bean!D2:D6`, `Hotel-Highlights!A2:H6`, `Gallery!A2:D20`. Đổi tên sheet hoặc cột cần đi kèm kiểm tra các thành phần đọc dữ liệu.

## 12 Cấu hình và hướng dẫn chạy

### 12.1 Chuẩn bị

Cài Node.js phù hợp yêu cầu từ 24 trở lên và npm theo khai báo dự án. Chuẩn bị MySQL, thông tin Google OAuth, PayOS, Pusher, email và Redis tương ứng với các chức năng cần sử dụng. Backend khởi tạo một số kết nối ngay khi import, nên không thể mặc định rằng bỏ trống mọi dịch vụ ngoài vẫn khởi động thành công.

Mỗi ứng dụng dùng một tệp `.env` riêng. Không đưa giá trị thật của mật khẩu, JWT secret, API key hoặc chuỗi kết nối vào kho công khai.

### 12.2 Biến môi trường backend

| Biến | Mục đích |
| --- | --- |
| DATABASE_URL | Chuỗi kết nối MySQL cho Prisma |
| PORT | Cổng backend; mặc định 5000 |
| FRONTEND_URL | CORS, liên kết email, redirect và liên kết phòng |
| BACKEND_URL | URL callback Google OAuth |
| JWT_SECRET | Ký và kiểm tra access token |
| REFRESH_TOKEN_SECRET | Ký và kiểm tra refresh token |
| SESSION_SECRET | Khóa session Express |
| EMAIL_USER, EMAIL_PASS | Tài khoản gửi email |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Google OAuth |
| PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY | Kết nối PayOS |
| PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET | Thông báo thời gian thực |
| API_KEY_AI | Adapter AI chính ModelAi |
| OPENAI_API_KEY | Adapter hoặc nhánh AI khác trong mã |
| UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN | Lịch sử hội thoại |
| PasswordRedis | Mật khẩu Redis Cloud; chú ý đúng chữ hoa thường |
| GOOGLEMAP_API_KEY | Tìm địa điểm phục vụ chatbot |
| UNSPLASH_ACCESS_KEY | Tìm ảnh cho bản nháp blog |

Redis Cloud còn có host và port viết cố định trong `repositories/redisClient.js`. Khóa thời tiết và một giá trị dự phòng cho tìm ảnh cũng cần được đưa ra cấu hình riêng khi hoàn thiện. Không sao chép các giá trị đó sang tài liệu hay môi trường mới.

### 12.3 Biến môi trường frontend

| Biến | Mục đích |
| --- | --- |
| NEXT_PUBLIC_URL_API | Địa chỉ backend; khi chạy tại máy thường là http://localhost:5000 |
| NEXT_PUBLIC_PUSHER_KEY | Khóa công khai Pusher |
| NEXT_PUBLIC_GGSHEETID | ID bảng tính cung cấp nội dung |
| NEXT_PUBLIC_API_GGSHEET | Khóa đọc nội dung Sheets |
| UPLOADTHING_TOKEN | Token máy chủ của UploadThing |

Biến bắt đầu `NEXT_PUBLIC_` có thể đi vào mã gửi xuống trình duyệt và được đóng vào bản build. Không dùng nhóm này để lưu bí mật phía máy chủ. Khi đổi URL API của frontend Docker cần truyền lại build args và build lại image.

### 12.4 Chạy backend

Mở PowerShell tại dự án, kiểm tra `.env` rồi chạy:

```powershell
Set-Location 'D:\DoAnTotNghiep\DATN_K22_Booking\booking_Backend'
node --version
npm --version
npm ci
npm run build
npm run dev
```

`npm ci` cài theo tệp khóa và chạy `postinstall` để tạo Prisma Client. `npm run build` của backend chỉ tạo Prisma Client, không tạo bảng và không biên dịch thành một thư mục `dist`.

Nếu đang dựng một cơ sở dữ liệu thử nghiệm mới, trống và đã kiểm tra đúng `DATABASE_URL`, có thể dùng lệnh dưới đây để đồng bộ schema. Với dữ liệu có sẵn, cần sao lưu và thiết kế migration trước khi thay đổi cấu trúc.

```powershell
npx prisma db push --schema=prisma/schema.prisma
```

Sau khi backend chạy, kiểm tra địa chỉ cơ bản:

```powershell
Invoke-RestMethod 'http://localhost:5000/'
```

Phản hồi dự kiến có trường `message` với nội dung `server running.....`. Tiếp theo cần thử một API đọc dữ liệu, vì phản hồi này chưa chứng minh kết nối cơ sở dữ liệu thành công.

### 12.5 Chạy frontend

Mở một cửa sổ PowerShell khác:

```powershell
Set-Location 'D:\DoAnTotNghiep\DATN_K22_Booking\booking_Frontend'
npm ci
npm run dev
```

Mở `http://localhost:3000`. Kiểm tra banner, danh sách loại phòng và một trang chi tiết trước khi thử đặt phòng. Cookie đăng nhập được cấu hình `secure: true`; khi chạy qua HTTP hoặc tên miền khác nhau cần kiểm tra cookie thực sự được trình duyệt lưu và gửi, đặc biệt với refresh token.

Để chạy bản build:

```powershell
npm run build
npm start
```

Lệnh trên dành cho frontend. Backend chạy production bằng `npm start` sau khi chuẩn bị Prisma Client và các biến môi trường.

### 12.6 Kiểm tra mã nguồn

```powershell
# Chạy trong booking_Backend
npm run lint
node --test lib/blog-draft.test.js

# Chạy trong booking_Frontend
npm run typecheck
npm run lint
```

Hai ứng dụng có lệnh `npm run check`; backend thực hiện lint rồi tạo Prisma Client, frontend thực hiện typecheck, lint và build. Dự án chưa khai báo script `npm test`. Bộ kiểm thử blog hiện dùng trực tiếp trình chạy test của Node.

### 12.7 Triển khai Docker

Backend sử dụng image Node 24 nền Debian slim, cài OpenSSL và certificate, chạy bằng người dùng `node` và mở cổng 5000. Frontend sử dụng Node 24 Alpine, build nhiều giai đoạn, sao chép kết quả `standalone` và chạy cổng 3000 bằng người dùng `nextjs`.

Lệnh tham khảo để tạo một container backend mới:

```powershell
Set-Location 'D:\DoAnTotNghiep\DATN_K22_Booking\booking_Backend'
docker build -t booking-backend .
docker run -d --name booking-backend --env-file .env -p 5000:5000 booking-backend
```

Chạy frontend bằng cấu hình Compose sẵn có:

```powershell
Set-Location 'D:\DoAnTotNghiep\DATN_K22_Booking\booking_Frontend'
docker compose up -d --build
```

Compose hiện chỉ định nghĩa frontend; không tự tạo MySQL, Redis, backend hoặc dịch vụ gợi ý. Trong container, `localhost` chỉ chính container đó. Vì frontend có cả tác vụ máy chủ và yêu cầu từ trình duyệt, URL API cần truy cập được từ đúng nơi phát sinh yêu cầu.

### 12.8 Quy trình triển khai hiện có

Workflow `booking_Backend/.github/workflows/deploy.yml` chạy khi push nhánh `master`, SSH vào VPS, kéo mã rồi dựng và chạy container. Workflow hiện truyền nhiều biến qua `--build-arg`, trong khi Dockerfile hiện tại không khai báo các ARG đó và lệnh `docker run` trong workflow không truyền biến môi trường. Cần đồng bộ lại bước cấp cấu hình runtime trước khi dùng workflow này.

Tác vụ giá mùa chạy trong tiến trình Node bằng `node-cron`. Máy chủ phải hoạt động tại thời điểm lịch chạy; nhiều bản sao backend có thể chạy trùng tác vụ. Có `vercel.json` cho backend nhưng các kết nối lâu dài và cron nội bộ cần được đánh giá riêng nếu chọn mô hình serverless.

## 13 Những điểm cần hoàn thiện

Các mục sau là nhận xét trực tiếp từ mã nguồn, kèm vị trí để kiểm tra. Mức ưu tiên phản ánh ảnh hưởng đến quyền truy cập, tiền thanh toán và tính đúng của dữ liệu; không phải kết quả thử tấn công hệ thống đang chạy.

### 13.1 Xác thực và quyền sở hữu

Nhiều thao tác sửa dữ liệu chưa gắn xác thực: tạo, sửa, xóa phòng; quản lý loại phòng và tiện nghi; sửa hồ sơ khách; xóa blog; xóa bảo trì. Danh sách đơn và khách cũng có route đọc công khai. Cần áp dụng xác thực và quyền tại backend theo từng thao tác. Nguồn: các tệp tương ứng trong `booking_Backend/api` và controller.

`removeBookingUser` chỉ truyền ID từ URL xuống service; truy vấn hủy không đối chiếu `customerId` với người đang đăng nhập. Cần kiểm tra quyền sở hữu đơn trước khi hủy. Quyền tạo đơn nhân viên phải được kiểm tra trước khi gọi service. Nguồn: `controller/booking.Controller.js`, `repositories/booking.repo.js`.

API descriptor trả dữ liệu khuôn mặt chỉ dựa vào email. Đây là dữ liệu nhận dạng cần giới hạn truy cập. Refresh token hiện được xác minh chữ ký rồi cấp token mới nhưng chưa kiểm tra lại trạng thái tài khoản và quyền hiện tại trong cơ sở dữ liệu. Nguồn: `controller/user.controller.js`, `services/user.service.js`.

### 13.2 Thanh toán và giá đơn

Webhook nhận trực tiếp trạng thái từ phía gọi và được trang kết quả thanh toán kích hoạt. Cần xác minh dữ liệu nhà cung cấp, đối chiếu số tiền, đơn và mã giao dịch, đồng thời đảm bảo xử lý lặp không làm sai trạng thái. Nguồn: `controller/payment.Controller.js`, `services/payment.service.js` và hai trang kết quả payment.

Tổng tiền và đơn giá đang được nhận từ frontend khi tạo Booking. Máy chủ cần tự tính lại số đêm, mùa giá, sức chứa và mã giảm giá từ dữ liệu tin cậy. Không nên tự hoàn tất mọi payment chỉ vì thực hiện nhận hoặc trả phòng. Nguồn: BookingSchema, booking service và `confirmStatusRepo`.

### 13.3 Trùng phòng và giao dịch nhiều bước

Kiểm tra trùng lịch khi tạo đơn chưa ràng buộc cùng một phòng giữa các khách khác nhau. Bổ sung kiểm tra giao nhau theo phòng, trạng thái đơn và cơ chế giao dịch chống tranh chấp đồng thời. Việc tìm phòng còn có các bộ lọc trạng thái chưa thống nhất: lịch đã đặt có `CHECKED_OUT`, còn bộ lọc ngày trong danh sách quản trị không loại rõ đơn hủy. Nguồn: `booking.repo.js`, `room.repo.js`.

Đơn được tạo trước khi gửi Pusher, email và audit log. Nếu một dịch vụ phụ trợ báo lỗi, client có thể nhận thất bại dù dữ liệu đã được ghi. Cần tách lỗi thông báo khỏi kết quả đặt phòng hoặc sử dụng hàng đợi gửi lại có kiểm soát. Nguồn: `booking.service.js`.

### 13.4 Thống kê và giá mùa

`RevenueTotalMonthRepo` nhóm theo `paymentDate`, sau đó gán `RevenueTotalMonth[month] = ...`. Khi có nhiều nhóm ngày trong cùng tháng, số trước bị ghi đè thay vì cộng dồn. Cần sửa phép tích lũy và bổ sung ca thử nhiều giao dịch trong tháng. Endpoint tên `revenue-online-offline` hiện trả số đơn theo nguồn, không phải doanh thu. Nguồn: `repositories/statistical.repo.js`.

Giá mùa dùng một `currentPrice` chung trong khi một phòng có nhiều SeasonalRate. Tạo mùa cập nhật giá ngay; xóa mùa chỉ ghi lại `originalPrice`, không khôi phục `currentPrice`. Hai cron cùng thời điểm cần thống nhất thứ tự và điều kiện ngày. Nguồn: `seasonal.repo.js`, `seasonal.service.js`, `room.service.js`.

### 13.5 Phiên AI và dữ liệu quản trị

Ngữ cảnh chat chung cấp module cần được tách theo phiên. Route mini-stats cần quyền quản trị và giới hạn phạm vi dữ liệu. Các endpoint AI nên có giới hạn tần suất, độ dài và thời gian xử lý để kiểm soát chi phí. Nguồn: `services/openai.service.js`, `api/openAl.route.js`.

### 13.6 Vận hành và khả năng bảo trì

Ưu tiên bổ sung migration, seed dữ liệu thử nghiệm, tài khoản quản trị đầu tiên, kiểm tra cấu hình lúc khởi động và endpoint tình trạng kết nối. Đồng bộ workflow Docker với cách truyền biến runtime. Tách host Redis, địa chỉ dịch vụ gợi ý, dữ liệu khách sạn và các khóa cố định khỏi mã nguồn.

Cần thống nhất cách trả lỗi và dữ liệu API, thêm xóa cache khi cập nhật, giảm log chứa dữ liệu người dùng, rà soát đường dẫn trang còn dư và tài liệu README cũ. Có thể thực hiện từng nhóm sau khi khóa các luồng đặt phòng và thanh toán.

## 14 Kiểm thử và nghiệm thu

### 14.1 Kết quả kiểm tra tại thời điểm lập tài liệu

Bộ kiểm thử `booking_Backend/lib/blog-draft.test.js` đã chạy: 8 bài đạt, 0 bài thất bại. Bộ này kiểm tra chủ đề, cấu trúc bản nháp, escape HTML, chọn ảnh, lỗi tìm ảnh, sửa JSON, giới hạn số lần thử và giữ bản ngắn đủ dùng. Kết quả này chỉ phản ánh module tạo nháp, không thay thế kiểm thử đặt phòng, xác thực và thanh toán.

Frontend đã chạy kiểm tra TypeScript bằng `tsc --noEmit --incremental false` và kết thúc thành công, không báo lỗi. Chế độ này kiểm tra kiểu mà không ghi kết quả biên dịch. Chưa chạy build production, kiểm thử giao diện trình duyệt hoặc giao dịch với dịch vụ ngoài trong đợt lập tài liệu này.

Việc kiểm tra đầy đủ giao dịch MySQL, PayOS, email, Google OAuth, microphone và camera cần môi trường thử nghiệm có cấu hình dịch vụ phù hợp. Không dùng việc trang thanh toán hiển thị thành công làm tiêu chí duy nhất để xác nhận đã thu tiền.

### 14.2 Các ca nghiệm thu cần chạy

| Nhóm | Tình huống | Kết quả cần đạt |
| --- | --- | --- |
| Khởi động | Chạy riêng backend và frontend | API và trang chủ hoạt động; lỗi dịch vụ ngoài có thông báo rõ |
| Đăng ký | Email mới, email trùng, giấy tờ trùng | Tạo đúng hồ sơ hoặc từ chối có lý do |
| Đăng nhập | Mật khẩu đúng sai, tài khoản khóa | Chỉ tài khoản hợp lệ được cấp phiên |
| Làm mới phiên | Hết access token, nhiều yêu cầu cùng lúc | Làm mới có kiểm soát; thất bại thì đăng nhập lại |
| Phân quyền | Lễ tân mở nhân sự; người lạ gọi API sửa phòng | Bị từ chối từ backend, không phát sinh dữ liệu |
| Tìm phòng | Ngày hợp lệ, ngày đảo ngược, phòng bảo trì | Chỉ trả phòng đáp ứng điều kiện |
| Đặt phòng | Đặt thường và đặt hộ | Booking, BookingItem và người lưu trú đúng |
| Đồng thời | Hai khách đặt cùng phòng cùng ngày | Chỉ một yêu cầu được chấp nhận |
| Giá mùa | Đơn đi qua hai mùa khác hệ số | Giá từng đêm và tổng tiền đúng |
| Giảm giá | Mã hợp lệ, chưa hiệu lực, hết hạn | Chỉ áp mã đáp ứng điều kiện |
| Thanh toán | QR thành công, hủy, callback lặp | Trạng thái đúng theo đối soát nhà cung cấp |
| Bảo vệ giá | Sửa amount hoặc totalAmount phía gọi | Máy chủ từ chối hoặc tính lại |
| Hủy đơn | Khách gọi hủy đơn của người khác | Từ chối, không đổi phòng hoặc payment |
| Lưu trú | Nhận phòng rồi trả phòng | Trạng thái đơn và phòng đúng; thu tiền được kiểm soát riêng |
| Bảo trì | Tạo lịch và hoàn tất | Không cho đặt phòng không khả dụng |
| Đánh giá | Người khác gửi review hoặc gửi lặp | Từ chối theo quyền sở hữu và quy tắc một lần |
| Blog | Tạo nháp AI, lỗi ảnh, xuất bản | Giữ nội dung hợp lệ; chỉ bài xuất bản hiện công khai |
| Thống kê | Hai khoản thu cùng tháng | Tổng bằng tổng payment COMPLETED |
| AI | Hai session trò chuyện khác chủ đề | Không lẫn ngữ cảnh hay dữ liệu |
| Khuôn mặt | Không cấp camera, sai khuôn mặt | Xử lý rõ ràng; không bỏ qua xác minh máy chủ |
| Triển khai | Chạy image mới với cấu hình runtime | Kết nối đúng DB, dịch vụ và URL callback |

### 14.3 Kịch bản trình diễn đồ án

Chuẩn bị dữ liệu riêng cho buổi trình diễn: một tài khoản khách, các vai trò nhân viên, tiện nghi, loại phòng, phòng trống, phòng bảo trì và một mã giảm giá còn hiệu lực. Không dùng dữ liệu cá nhân thật trong môi trường trình diễn.

Trình diễn theo thứ tự: trang chủ và tìm phòng; đăng nhập; đặt phòng; xem lịch sử; nhân viên xem thông báo và nhận trả phòng; khách đánh giá; quản lý kiểm tra báo cáo; nhân viên marketing tạo bản nháp AI rồi xuất bản. Với QR, chỉ trình diễn trên tài khoản và môi trường đã được chuẩn bị để kiểm soát giao dịch.

## 15 Bản đồ tệp để tiếp tục phát triển

Các đường dẫn trong bảng là tương đối từ thư mục gốc dự án. Đây là điểm bắt đầu cho từng nhóm thay đổi; các component con cùng thư mục chứa phần biểu mẫu và hiển thị chi tiết.

| Nhu cầu | Tệp hoặc thư mục cần xem |
| --- | --- |
| Thay cấu hình máy chủ hoặc gắn API | booking_Backend/server.js |
| Thay mô hình dữ liệu | booking_Backend/prisma/schema.prisma |
| Sửa tạo đơn và chuyển trạng thái | booking_Backend/controller/booking.Controller.js; services/booking.service.js; repositories/booking.repo.js |
| Sửa tìm phòng và tính giá | booking_Backend/services/room.service.js; repositories/room.repo.js |
| Sửa thanh toán | booking_Backend/controller/payment.Controller.js; services/payment.service.js; repositories/payment.repo.js |
| Sửa tài khoản và phiên | booking_Backend/services/user.service.js; lib/authCustomer.js; lib/authEmployee.js |
| Sửa quyền | booking_Backend/middleware; lib/hasUserPermission.js |
| Sửa blog AI | booking_Backend/lib/blog-draft.js; lib/blog-draft.test.js; services/openai.service.js |
| Sửa báo cáo | booking_Backend/repositories/statistical.repo.js; repositories/openai.repo.js |
| Sửa điều hướng quản trị | booking_Frontend/src/proxy.ts; src/lib/roles.ts |
| Sửa menu quản trị | booking_Frontend/src/app/(dashboard)/components/navbar |
| Sửa đăng nhập và làm mới token | booking_Frontend/src/hook/useUserStore.ts; src/lib/axios.ts |
| Sửa biểu mẫu đặt phòng khách | booking_Frontend/src/app/(client)/rooms/components |
| Sửa biểu mẫu đặt phòng tại quầy | booking_Frontend/src/app/(dashboard)/admin/bookings/add-booking |
| Sửa nhận trả phòng và hóa đơn | booking_Frontend/src/app/(dashboard)/admin/bookings/listbooking |
| Sửa chatbot và giọng nói | booking_Frontend/src/app/(client)/components/main/ChatBoxAl.tsx; src/hook/useVoiceAssistant.ts |
| Sửa nhận diện | booking_Frontend/src/hook/useFaceLogin.ts; src/lib/faceapi-loader.ts |
| Sửa xuất báo cáo Excel | booking_Frontend/src/lib/exportExcel.ts |
| Sửa tải ảnh | booking_Frontend/src/app/api/uploadthing/core.ts |
| Sửa nội dung trang chủ | booking_Frontend/src/app/(client)/page.tsx và components/main |

Trong các ô liệt kê nhiều tệp backend, đường dẫn rút gọn `services/`, `repositories/`, `lib/` và `middleware/` đều nằm dưới `booking_Backend`. Trong các ô frontend, `src/` nằm dưới `booking_Frontend`.

### 15.1 Thứ tự hoàn thiện đề xuất

1. Khóa xác thực và quyền cho API, kiểm tra quyền sở hữu dữ liệu, bảo vệ descriptor.
2. Tính lại giá tại máy chủ, chống đặt trùng phòng và xác minh thanh toán.
3. Thống nhất trạng thái đơn, payment, phòng, giá mùa và số liệu báo cáo.
4. Chuẩn hóa migration, seed và cấu hình Docker; bổ sung kiểm thử các luồng trọng yếu.
5. Tách ngữ cảnh AI theo phiên, kiểm soát truy cập thống kê và hoàn thiện dịch vụ ngoài.

### 15.2 Nguồn đối chiếu trong dự án

Tài liệu đối chiếu với `package.json`, `package-lock.json`, cấu hình Docker và Next.js, schema Prisma, toàn bộ nhóm router, các controller, service và repository nghiệp vụ, danh mục trang và thành phần frontend, các hook xác thực, giọng nói, khuôn mặt và bộ kiểm thử blog. README của hai ứng dụng được dùng để tham khảo mục đích; khi khác với mã hiện tại, cấu hình và luồng thực thi trong mã là căn cứ mô tả.

Bản Markdown và bản Word dùng cùng nội dung để thuận tiện chỉnh sửa và bàn giao. Sau mỗi lần thay đổi schema, API, quyền hoặc cấu hình triển khai, cần cập nhật các phần tương ứng trong tài liệu và tạo lại bản Word.
