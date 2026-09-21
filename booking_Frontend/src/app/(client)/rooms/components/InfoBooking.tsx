"use client";
import { useBookingStore } from "@/hook/useBookingForm";
import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import React from "react";

const InfoBooking = () => {
  const { formData } = useBookingStore();

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    return Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  const nights = calculateNights();
  const originalTotal = formData.totalAmount + (formData.discountAmount ?? 0);
  const hasDiscount =
    !!formData.discountId && (formData.discountAmount ?? 0) > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          Thông tin đặt phòng
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Ngày */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Ngày nhận phòng</p>
            <p className="font-semibold text-gray-800 text-sm">
              {formatDate(formData.checkInDate)}
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Ngày trả phòng</p>
            <p className="font-semibold text-gray-800 text-sm">
              {formatDate(formData.checkOutDate)}
            </p>
          </div>
        </div>

        {/* Số đêm & Số khách */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Số đêm</p>
            <p className="font-semibold text-gray-800 text-sm">{nights} đêm</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">Số khách</p>
            <p className="font-semibold text-gray-800 text-sm">
              {formData.totalGuests} người
            </p>
          </div>
        </div>

        {/* Giá mỗi đêm */}
        <div className="px-5 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">Giá mỗi đêm</span>
          <span className="text-sm font-semibold text-gray-800">
            {formatPrice(formData.pricePerNight)}
          </span>
        </div>

        {/* Giảm giá */}
        {hasDiscount && (
          <>
            <div className="px-5 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Giá gốc</span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalTotal)}
              </span>
            </div>
            <div className="px-5 py-3 flex justify-between items-center bg-green-50">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                  Mã giảm giá
                </span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                - {formatPrice(formData.discountAmount ?? 0)}
              </span>
            </div>
          </>
        )}

        {/* Tổng tiền */}
        <div className="px-5 py-4 flex justify-between items-center bg-blue-50">
          <span className="text-base font-bold text-gray-800">
            Tổng thanh toán
          </span>
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(formData.totalAmount)}
          </span>
        </div>

        {/* Yêu cầu đặc biệt */}
        {formData.specialRequests && (
          <div className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-2">Yêu cầu đặc biệt</p>
            <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {formData.specialRequests}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default InfoBooking;
