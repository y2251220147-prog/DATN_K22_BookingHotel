"use client";
import { calculateNights, formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { Label } from "@/components/ui/label";

import { URL_API } from "@/lib/fetcher";
import QrCodePayment from "./QrCodePayment";
import { BookingFormData } from "./BookingForm";
import { CustomerForm } from "../page";
import {
  BookingToEmployee,
  CustomerFromEmployee,
  PaymentForBooking,
} from "@/services/ApiService";

interface IPaymen {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  formCustomer: CustomerForm;
  formBooking: BookingFormData;
  setFormBooking: React.Dispatch<React.SetStateAction<BookingFormData>>;
  seasonPrice: {
    total: number;
    currentPrice: number;
    originalPrice: number;
    displayPrice: number;
  };
}

const FormPaymentBooking = ({
  seasonPrice,
  formCustomer,
  isOpen,
  setIsOpen,
  formBooking,
  setFormBooking,
}: IPaymen) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [nights, setNights] = useState(0);
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  useEffect(() => {
    if (formBooking.checkInDate && formBooking.checkOutDate) {
      const calculatedNights = calculateNights(
        formBooking.checkInDate,
        formBooking.checkOutDate
      );
      setNights(Number(calculatedNights));
    }
  }, [formBooking.checkInDate, formBooking.checkOutDate]);

  async function ApplyDisCount() {
    if (!formBooking.discountCode) {
      setDiscount(0);
      setFormBooking((prev) => ({
        ...prev,
        totalAmount: seasonPrice.total,
      }));
      toast("Đã hủy mã giảm giá, giá phòng trở lại ban đầu.");
      return;
    }

    try {
      const res = await axios.get(
        `${URL_API}/api/discount?code=${formBooking.discountCode}`,
        { withCredentials: true }
      );

      const percentage = Number(res?.data?.data?.percentage ?? 0);

      if (percentage > 0) {
        const baseTotal = seasonPrice.total;
        const discountedTotal = baseTotal * (1 - percentage / 100);

        setDiscount(percentage);
        setFormBooking((prev) => ({
          ...prev,
          totalAmount: Math.round(discountedTotal),
        }));

        toast.success("Áp dụng mã giảm giá thành công!");
      } else {
        setDiscount(0);
        setFormBooking((prev) => ({
          ...prev,
          totalAmount: seasonPrice.total,
        }));
        toast("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error: any) {
      setDiscount(0);
      setFormBooking((prev) => ({
        ...prev,
        totalAmount: seasonPrice.total,
      }));
      toast.error(error?.response?.data?.message || "Mã giảm giá không hợp lệ");
    }
  }

  console.log(discount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let idCustomer = formCustomer.id;

    try {
      // Nếu chưa có khách hàng thì tạo mới
      if (!idCustomer) {
        const newCustomerId = await CustomerFromEmployee(formCustomer);
        if (!newCustomerId) {
          toast.error("Không tạo được khách hàng");
          return;
        }
        idCustomer = newCustomerId;
      }

      // Tạo booking
      const resBooking = await BookingToEmployee({
        ...formBooking,
        customerId: idCustomer, // gắn id khách hàng vào
      });
      if (!resBooking) {
        toast.error("Không tạo được booking");
        return;
      }

      // Thanh toán
      const payment = await PaymentForBooking(
        resBooking,
        formBooking.totalAmount,
        paymentMethod
      );

      if (payment) {
      } else {
        toast.error("Thanh toán thất bại, vui lòng thử lại!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsOpen(false);
      setFormBooking({
        customerId: "",
        checkInDate: null,
        checkOutDate: null,
        totalGuests: 1,
        bookingSource: "DIRECT",
        specialRequests: "",
        discountCode: "",
        pricePerNight: 0,
        roomId: "",
        totalAmount: 0,
      });
    }
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Payment Confirmation"
      className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-5 outline-none"
      overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-auto"
    >
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Xác Nhận Thanh Toán</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Chi Tiết Booking</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ngày Nhận Phòng:</span>
                <span className="font-medium">
                  {formBooking.checkOutDate
                    ? formatDate(formBooking.checkInDate)
                    : null}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Ngày Trả Phòng:</span>
                <span className="font-medium">
                  {formBooking.checkOutDate
                    ? formatDate(formBooking.checkOutDate)
                    : null}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Thời Gian:</span>
                <span className="font-medium">
                  {nights} {nights === 1 ? "Đêm" : "Đêm"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tổng Số Khách Hàng:</span>
                <span className="font-medium">
                  {formBooking.totalGuests} khách
                </span>
              </div>

              {formBooking.specialRequests && (
                <div className="pt-2">
                  <span className="block mb-1">yêu cầu :</span>
                  <p className="text-sm bg-white p-2 rounded border">
                    {formBooking.specialRequests}
                  </p>
                </div>
              )}
              <div className="p-2 bg-gray-50">
                <input
                  type="text"
                  className="p-2 border"
                  placeholder="nhập mã giảm giá "
                  value={formBooking.discountCode.toUpperCase()}
                  onChange={(e) =>
                    setFormBooking((prev) => ({
                      ...prev,
                      discountCode: e.target.value,
                    }))
                  }
                />
                <button
                  className="p-2 text-white bg-green-600 "
                  type="button"
                  onClick={ApplyDisCount}
                >
                  Áp Dụng
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                <span>Giá Một Đêm:</span>
                <span className="font-medium">
                  {formatPrice(formBooking.pricePerNight)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-xl mt-2">
                <span>Tổng Số Tiền:</span>
                <span className="text-blue-500">
                  {formatPrice(formBooking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Chọn Phương Thức Thanh Toán
            </h3>
            <div className="space-y-4">
              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === "CASH"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span className="ml-3 text-gray-700">Tiền Mặt</span>
              </Label>

              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QR_CODE"
                  checked={paymentMethod === "QR_CODE"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />

                <span className="ml-3 text-gray-700">Thẻ Ngân Hàng</span>
              </Label>
              {/* Render QR code bên ngoài label */}

              {paymentMethod === "QR_CODE" && (
                <div className="mt-2">
                  <QrCodePayment Amount={formBooking.totalAmount} />
                </div>
              )}

              <Label className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mobilePayment"
                  checked={paymentMethod === "mobilePayment"}
                  onChange={handlePaymentMethodChange}
                  className="form-radio h-5 w-5 text-blue-500"
                />
                <span className="ml-3 text-gray-700">
                  Thanh Toán Qua Ứng Dụng
                </span>
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-600 mr-3 hover:bg-gray-100 rounded disabled:opacity-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!paymentMethod}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
          >
            Xác Nhận
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default React.memo(FormPaymentBooking);
