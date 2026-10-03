"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { IBookingRecord } from "./bookingad";
import { formatPrice } from "@/lib/formatPrice";
import {
  translatePaymentMethod,
  translatePaymentStatus,
  translateStatus,
} from "@/lib/translate";
import { calculateNights, formatDate } from "@/lib/formatDate";

const Invoice = ({ booking }: { booking: IBookingRecord }) => {
  // ✅ Khai báo ref với type rõ ràng
  const invoiceRef = useRef<HTMLDivElement>(null);

  // ✅ Truyền contentRef trực tiếp, không dùng arrow function
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // Không dùng () => invoiceRef.current
    documentTitle: `HoaDon_${booking.id}`,
  });

  const hotelInfo = {
    name: "Khách Sạn DAU",
    address: "Trường Đại học Kiến trúc Đà Nẵng, 566 Núi Thành, Hải Châu, Đà Nẵng, Việt Nam",
    phone: "0258 123 4567",
    email: "contact@bienxanhhotel.vn",
    logo: "/image/logo.png",
  };

  return (
    <div className="flex flex-col items-center">
      {/* ✅ Gọi handlePrint trực tiếp hoặc wrap trong arrow function */}
      <button onClick={() => handlePrint()}>In hóa đơn</button>

      {/* Hóa đơn render ẩn để sẵn sàng in */}
      <div style={{ display: "none" }}>
        <div
          className="bg-white shadow-md rounded-lg w-full p-8 text-sm"
          ref={invoiceRef}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h1 className="text-xl font-bold">{hotelInfo.name}</h1>
              <p>{hotelInfo.address}</p>
              <p>📞 {hotelInfo.phone}</p>
              <p>✉️ {hotelInfo.email}</p>
            </div>
            <div>
              <Image
                src={hotelInfo.logo}
                alt="Hotel Logo"
                width={100}
                height={100}
              />
            </div>
          </div>

          {/* Thông tin hóa đơn */}
          <div className="mb-6">
            <h2 className="text-center text-xl font-semibold mb-2">
              HÓA ĐƠN THANH TOÁN
            </h2>
            <p>
              Mã đơn:{" "}
              <strong>#{booking.id.replace(/-/g, "").slice(0, 8)}</strong>
            </p>
            <p>Ngày đặt: {formatDate(booking.createdAt)}</p>
            <p>
              Trạng thái: <strong>{translateStatus(booking.status)}</strong>
            </p>
          </div>

          {/* Khách hàng */}
          <div className="mb-4">
            <h3 className="font-semibold">Thông tin khách hàng</h3>
            <p>
              Họ và Tên:{booking.customer?.user?.firstName}{" "}
              {booking.customer?.user?.lastName}
            </p>
            <p>CCCD: {booking.customer?.idNumber || "-"}</p>
            <p>Email: {booking.customer?.user?.email}</p>
            <p>Điện thoại: {booking.customer?.user?.phone}</p>
          </div>

          {/* Chi tiết phòng */}
          <table className="w-full border-collapse border text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Phòng</th>
                <th className="border p-2 text-left">Loại phòng</th>
                <th className="border p-2 text-center">Ngày nhận</th>
                <th className="border p-2 text-center">Ngày trả</th>
                <th className="border p-2 text-center">Thời Gian</th>
                <th className="border p-2 text-right">Giá (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {booking.bookingItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">P{item.room.roomNumber}</td>
                  <td className="border p-2">{item.room.roomType.name}</td>
                  <td className="border p-2 text-center">
                    {formatDate(booking.checkInDate)}
                  </td>
                  <td className="border p-2 text-center">
                    {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="border p-2 text-center">
                    {calculateNights(booking.checkInDate, booking.checkOutDate)}
                    /đêm
                  </td>
                  <td className="border p-2 text-right">
                    {formatPrice(Number(booking.totalAmount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Thanh toán */}
          <div className="mb-6">
            <h3 className="font-semibold mb-1">Thanh toán</h3>
            {booking.payments.length > 0 ? (
              booking.payments.map((p) => (
                <div key={p.id} className="flex justify-between border-b py-1">
                  <span>{translatePaymentMethod(p.paymentMethod)}</span>
                  <span>{formatPrice(p.amount)}</span>
                  <span>{translatePaymentStatus(p.status)}</span>
                </div>
              ))
            ) : (
              <p>Chưa có thanh toán</p>
            )}
          </div>

          {/* Tổng cộng */}
          <div className="text-right text-lg font-bold">
            Tổng cộng: {formatPrice(Number(booking.totalAmount))}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của {hotelInfo.name}!</p>
            <p>Hẹn gặp lại quý khách lần sau 🌸</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
