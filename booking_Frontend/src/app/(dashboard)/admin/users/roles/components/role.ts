export const ROLE_OPTIONS = [
  { value: "ADMIN", label: "General Manager - Tổng Quản Lý" },
  { value: "MANAGER", label: "Manager - Quản Lý" },
  { value: "FRONT_DESK", label: "Front Desk - Lễ Tân" },
  { value: "MAINTENANCE", label: "Maintenance - Bảo Trì" },
  { value: "MARKETING", label: "Marketing - Marketing" },
] as const;

type RoleOption = (typeof ROLE_OPTIONS)[number]["value"];

export const PERMISSION_GROUPS = [
  {
    label: "Đặt phòng (Booking)",
    permissions: [
      { key: "BOOKING_READ", label: "Xem" },
      { key: "BOOKING_CREATE", label: "Tạo mới" },
      { key: "BOOKING_UPDATE", label: "Cập nhật" },
      { key: "BOOKING_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Khách hàng (Customer)",
    permissions: [
      { key: "CUSTOMER_READ", label: "Xem" },
      { key: "CUSTOMER_CREATE", label: "Tạo mới" },
      { key: "CUSTOMER_UPDATE", label: "Cập nhật" },
      { key: "CUSTOMER_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Phòng (Room)",
    permissions: [
      { key: "ROOM_READ", label: "Xem" },
      { key: "ROOM_CREATE", label: "Tạo mới" },
      { key: "ROOM_UPDATE", label: "Cập nhật" },
      { key: "ROOM_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Loại phòng (Room Type)",
    permissions: [
      { key: "ROOM_TYPE_READ", label: "Xem" },
      { key: "ROOM_TYPE_CREATE", label: "Tạo mới" },
      { key: "ROOM_TYPE_UPDATE", label: "Cập nhật" },
      { key: "ROOM_TYPE_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Giá theo mùa (Seasonal Rate)",
    permissions: [
      { key: "SEASONAL_RATE_READ", label: "Xem" },
      { key: "SEASONAL_RATE_CREATE", label: "Tạo mới" },
      { key: "SEASONAL_RATE_UPDATE", label: "Cập nhật" },
      { key: "SEASONAL_RATE_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Bảo trì (Maintenance)",
    permissions: [
      { key: "MAINTENANCE_READ", label: "Xem" },
      { key: "MAINTENANCE_UPDATE", label: "Cập nhật" },
    ],
  },
  {
    label: "Thanh toán (Payment)",
    permissions: [
      { key: "PAYMENT_READ", label: "Xem" },
      { key: "PAYMENT_CREATE", label: "Tạo mới" },
      { key: "PAYMENT_UPDATE", label: "Cập nhật" },
    ],
  },
  {
    label: "Đánh giá (Review)",
    permissions: [
      { key: "REVIEW_READ", label: "Xem" },
      { key: "REVIEW_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Mã giảm giá (Discount)",
    permissions: [
      { key: "DISCOUNT_READ", label: "Xem" },
      { key: "DISCOUNT_CREATE", label: "Tạo mới" },
      { key: "DISCOUNT_UPDATE", label: "Cập nhật" },
      { key: "DISCOUNT_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Bài đăng (Blog)",
    permissions: [
      { key: "BLOG_READ", label: "Xem" },
      { key: "BLOG_CREATE", label: "Tạo mới" },
      { key: "BLOG_UPDATE", label: "Cập nhật" },
      { key: "BLOG_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Nhân viên / Người dùng (User)",
    permissions: [
      { key: "USER_READ", label: "Xem" },
      { key: "USER_CREATE", label: "Tạo mới" },
      { key: "USER_UPDATE", label: "Cập nhật" },
      { key: "USER_DELETE", label: "Xóa" },
    ],
  },
  {
    label: "Quyền & Báo cáo",
    permissions: [
      { key: "ROLE_MANAGE", label: "Phân quyền" },
      { key: "REPORT_VIEW", label: "Xem báo cáo" },
    ],
  },
  {
    label: "Nhật ký hệ thống (Audit Log)",
    permissions: [{ key: "AUDIT_LOG_READ", label: "Xem" }],
  },
];

export const PERM_LABELS: Record<string, string> = {
  BOOKING_READ: "Xem đặt phòng",
  BOOKING_CREATE: "Tạo đặt phòng",
  BOOKING_UPDATE: "Cập nhật đặt phòng",
  BOOKING_DELETE: "Xóa đặt phòng",
  CUSTOMER_READ: "Xem khách hàng",
  CUSTOMER_CREATE: "Tạo khách hàng",
  CUSTOMER_UPDATE: "Cập nhật khách hàng",
  CUSTOMER_DELETE: "Xóa khách hàng",
  ROOM_READ: "Xem phòng",
  ROOM_CREATE: "Tạo phòng",
  ROOM_UPDATE: "Cập nhật phòng",
  ROOM_DELETE: "Xóa phòng",
  ROOM_TYPE_READ: "Xem loại phòng",
  ROOM_TYPE_CREATE: "Tạo loại phòng",
  ROOM_TYPE_UPDATE: "Cập nhật loại phòng",
  ROOM_TYPE_DELETE: "Xóa loại phòng",
  SEASONAL_RATE_READ: "Xem giá mùa",
  SEASONAL_RATE_CREATE: "Tạo giá mùa",
  SEASONAL_RATE_UPDATE: "Cập nhật giá mùa",
  SEASONAL_RATE_DELETE: "Xóa giá mùa",
  MAINTENANCE_READ: "Xem bảo trì",
  MAINTENANCE_UPDATE: "Cập nhật bảo trì",
  PAYMENT_READ: "Xem thanh toán",
  PAYMENT_CREATE: "Tạo thanh toán",
  PAYMENT_UPDATE: "Cập nhật thanh toán",
  REVIEW_READ: "Xem đánh giá",
  REVIEW_DELETE: "Xóa đánh giá",
  DISCOUNT_READ: "Xem khuyến mãi",
  DISCOUNT_CREATE: "Tạo khuyến mãi",
  DISCOUNT_UPDATE: "Cập nhật khuyến mãi",
  DISCOUNT_DELETE: "Xóa khuyến mãi",
  BLOG_READ: "Xem bài viết",
  BLOG_CREATE: "Tạo bài viết",
  BLOG_UPDATE: "Cập nhật bài viết",
  BLOG_DELETE: "Xóa bài viết",
  USER_READ: "Xem nhân viên",
  USER_CREATE: "Tạo nhân viên",
  USER_UPDATE: "Cập nhật nhân viên",
  USER_DELETE: "Xóa nhân viên",
  ROLE_MANAGE: "Phân quyền",
  REPORT_VIEW: "Xem báo cáo",
  AUDIT_LOG_READ: "Xem nhật ký",
};
