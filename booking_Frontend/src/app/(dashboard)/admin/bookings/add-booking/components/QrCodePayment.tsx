import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import React from "react";

interface IQrCode {
  Amount: number;
}
const QrCodePayment = ({ Amount }: IQrCode) => {
  const bankCode = "MBBANK";
  const accountNumber = "0372204152";
  const accountName = "Trương Nhật Cường";
  const amount = Amount; // VNĐ
  const description = `thanh toán tiền Phòng `;
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    description
  )}&accountName=${encodeURIComponent(accountName)}`;
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Quét mã QR để thanh toán</h2>
      <Image
        src={qrUrl}
        alt=""
        width={300}
        height={300}
        className="object-contain"
      />
      <p className="mt-4">Ngân hàng: {bankCode}</p>
      <p>Số tài khoản: {accountNumber}</p>
      <p>Số tiền: {formatPrice(amount)} </p>
      <p>Nội dung: {description}</p>
    </div>
  );
};

export default QrCodePayment;
