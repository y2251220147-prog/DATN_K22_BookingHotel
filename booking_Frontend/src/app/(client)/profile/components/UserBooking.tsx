"use client";
import React from "react";
import Image from "next/image";
import { Home, CalendarDays, Users } from "lucide-react";
import { calculateNights, formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import {
  translatePaymentMethod,
  translatePaymentStatus,
} from "@/lib/translate";
import RemoveBooking from "./RemoveBooking";
import ReviewCusTomer from "./ReviewCusTomer";
import { Booking } from "./profileBooking";

// ── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
  CHECKED_IN: {
    label: "Đang ở",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  CHECKED_OUT: {
    label: "Đã trả phòng",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    dot: "bg-purple-500",
  },
  CANCELLED: {
    label: "Đã huỷ",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-400",
  },
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  REFUNDED: "bg-blue-100 text-blue-800",
  FAILED: "bg-red-100 text-red-800",
};

// ── Component ─────────────────────────────────────────────────────────────────
const BookingCard = ({ booking }: { booking: Booking }) => {
  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
  const st = STATUS_CONFIG[booking.status] ?? {
    label: booking.status,
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
  };
  const firstRoom = booking.bookingItems[0]?.room;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* ── Top: Room info + Status ── */}
      <div className="flex items-start gap-5 p-6 border-b border-gray-50">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {firstRoom?.images?.[0]?.imageUrl ? (
            <Image
              src={firstRoom.images[0].imageUrl}
              alt={firstRoom.roomNumber}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-7 h-7 text-gray-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-gray-900 truncate">
                {firstRoom?.roomType?.name ?? "—"}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Phòng {firstRoom?.roomNumber}
                {booking.bookingItems.length > 1
                  ? ` · +${booking.bookingItems.length - 1} phòng khác`
                  : firstRoom?.floor
                    ? ` · Tầng ${firstRoom.floor}`
                    : ""}
              </p>
              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {firstRoom?.roomType?.amenities?.slice(0, 4).map((a, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium"
                  >
                    {a.amenity.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 ${st.bg} ${st.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>

          {/* Mã đơn */}
          <p className="text-[11px] text-gray-400 font-mono mt-2">
            Mã đơn: #{booking.id.slice(0, 12).toUpperCase()}
          </p>
        </div>
      </div>

      {/* ── Middle: Dates ── */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
        <div className="px-6 py-4">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Nhận phòng
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatDate(booking.checkInDate)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Từ 14:00</p>
        </div>
        <div className="px-6 py-4 flex  items-center justify-center text-center">
          <p className="text-lg font-bold text-blue-600">{nights}/</p>
          <p className="text-base text-gray-500 mr-2">đêm</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <Users className="w-3 h-3" />
            <span className="text-base">{booking.totalGuests} khách</span>
          </div>
        </div>
        <div className="px-6 py-4 text-right">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 justify-end">
            <CalendarDays className="w-3 h-3" /> Trả phòng
          </p>
          <p className="text-sm font-bold text-gray-900">
            {formatDate(booking.checkOutDate)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Trước 12:00</p>
        </div>
      </div>

      {/* ── Bottom: Payment + Actions ── */}
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        {/* Payment info */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
              Tổng tiền
            </p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(Number(booking.totalAmount))}
            </p>
          </div>
          {booking.payments[0] && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                Thanh toán
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  {translatePaymentMethod(booking.payments[0].paymentMethod)}
                </p>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${PAYMENT_STATUS_STYLES[booking.payments[0].status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {translatePaymentStatus(booking.payments[0].status)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {booking.status === "CHECKED_OUT" && (
            <ReviewCusTomer bookingId={booking.id} />
          )}
          {booking.status === "PENDING" && (
            <RemoveBooking
              bookingId={booking.id}
              paymentMethod={booking?.payments[0]?.paymentMethod}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
