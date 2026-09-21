import { Banknote, QrCode } from "lucide-react";

export enum PaymentMethod {
  CASH = "CASH",
  QR_CODE = "QR_CODE",
}

export const paymentMethodDescriptions: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Thanh toán bằng tiền mặt khi nhận phòng",
  [PaymentMethod.QR_CODE]: "Quét mã QR bằng ứng dụng ngân hàng của bạn",
};

export const paymentMethodIcons: Record<
  PaymentMethod,
  React.ComponentType<{ className: string }>
> = {
  [PaymentMethod.CASH]: Banknote,
  [PaymentMethod.QR_CODE]: QrCode,
};
