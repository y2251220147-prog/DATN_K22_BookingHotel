import { PaymentMethod } from "@/app/(client)/rooms/components/booking";
import {
  Department,
  Position,
} from "@/app/(dashboard)/admin/profile/components/employee";

// Translate status to Vietnamese
export const translateStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CHECKED_IN: "Đã nhận phòng",
    CHECKED_OUT: "Đã trả phòng",
    CANCELLED: "Đã hủy",
    NO_SHOW: "Không đến",
  };
  return statusMap[status] || status;
};
export const translatePaymentStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ thanh toán",
    COMPLETED: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền",
  };

  return statusMap[status] || status;
};
// Translate payment method
export const translatePaymentMethod = (method: string) => {
  const methodMap: Record<string, string> = {
    CASH: "Tiền mặt",
    CREDIT_CARD: "Thẻ tín dụng",
    DEBIT_CARD: "Thẻ ghi nợ",
    BANK_TRANSFER: "Chuyển khoản",
    PAYPAL: "PayPal",
    MOBILE_PAYMENT: "Ví điện tử",
  };
  return methodMap[method] || method;
};

export const translateDepartment = (
  dept: Department | null | undefined
): string => {
  const departments: Record<Department, string> = {
    MANAGEMENT: "Quản Lý",
    FRONT_DESK: "Lễ Tân",
    MAINTENANCE: "Bảo Trì",
  };
  return dept ? departments[dept] || dept : "Chưa phân công";
};

// translate position with proper typing
export const translatePosition = (pos: Position | null | undefined): string => {
  const positions: Record<Position, string> = {
    MANAGEMENT: "Quản Lý",
    FRONT_DESK: "Lễ Tân",
    MAINTENANCE: "Bảo Trì",
  };
  return pos ? positions[pos] || pos : "Nhân viên";
};

export function translateMaintenanceStatus(status: string): string {
  switch (status) {
    case "SCHEDULED":
      return "Đã lên lịch";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

export function translateUserStatus(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "đang hoạt động";
    case "INACTIVE":
      return "vô hiệu hóa";
    default:
      return "Không xác định";
  }
}

export const translatepaymentMethodDisplayNames: Record<PaymentMethod, string> =
  {
    [PaymentMethod.CASH]: "Tiền Mặt",
    // [PaymentMethod.CREDIT_CARD]: "Thẻ Tín Dụng",
    // [PaymentMethod.PAYPAL]: "PayPal",
    [PaymentMethod.QR_CODE]: "QR Code",
  };
