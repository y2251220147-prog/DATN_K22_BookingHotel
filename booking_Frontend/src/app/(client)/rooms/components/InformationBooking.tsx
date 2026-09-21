import { calculateNights } from "@/lib/formatDate";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import InfoBooking from "./InfoBooking";
import { CheckIcon } from "lucide-react";
import {
  PaymentMethod,
  paymentMethodDescriptions,
  paymentMethodIcons,
} from "./booking";
import { useBookingStore } from "@/hook/useBookingForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { translatepaymentMethodDisplayNames } from "@/lib/translate";
import { formatPrice } from "@/lib/formatPrice";

interface IInformationProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
}

const InformationBooking = ({ isOpen, setIsOpen }: IInformationProps) => {
  const { formData, resetForm } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // State quản lý bước hiện tại
  const [isBookingForOther, setIsBookingForOther] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(PaymentMethod.CASH);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    checkInDate: null,
    checkOutDate: null,
  });

  useEffect(() => {
    if (isBookingForOther) {
      setGuestInfo({
        fullName: "",
        email: "",
        phone: "",
        idNumber: "",
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
      });
      setCurrentStep(1);
    }
  }, [isBookingForOther, formData]);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const resUser = await axiosInstance.get(`/api/auth/user`);
      setUser(resUser?.data);
    };
    if (localStorage.getItem("token")) {
      fetchUser();
    }
  }, []);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation trước khi chuyển bước
    if (currentStep === 1) {
      if (isBookingForOther) {
        if (!guestInfo.fullName || !guestInfo.phone || !guestInfo.idNumber) {
          alert("Vui lòng điền đầy đủ thông tin!");
          return;
        }
      }
      setCurrentStep(2); // Chuyển sang bước 2
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isBookingForOther) {
      try {
        //createGuest
        const resGuest = await axiosInstance.post(`/api/auth/guest`, guestInfo);
        if (resGuest.data) {
          const guestId = resGuest.data.newgest.id;
          const bookingData = {
            ...formData,
            guestId: guestId,
          };

          // reservation for other
          const res = await axiosInstance.post(`/api/booking`, bookingData);

          if (res.data) {
            const resPayment = await axiosInstance.post(`/api/payment`, {
              amount: formData.totalAmount,
              paymentMethod: selectedPaymentMethod,
              bookingId: res.data.data.id,
              status: "PENDING",
            });
            if (resPayment.data) {
              if (selectedPaymentMethod === PaymentMethod.CASH) {
                toast.success("Đặt phòng thành công!");
                router.push("/profile/bookings");
              } else if (
                selectedPaymentMethod === PaymentMethod.QR_CODE &&
                resPayment.data.status === "redirect"
              ) {
                const { url } = resPayment.data;
                window.location.href = url;
              }
            }
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
      } finally {
        setIsSubmitting(false);
        resetForm();
        setIsOpen(false);
      }
    } else {
      try {
        const res = await axiosInstance.post(`/api/booking`, formData);

        if (res.data) {
          const resPayment = await axiosInstance.post(`/api/payment`, {
            amount: formData.totalAmount,
            paymentMethod: selectedPaymentMethod,
            bookingId: res.data.data.id,
            status: "PENDING",
          });
          if (resPayment.data) {
            toast.success("Đặt phòng thành công!");
            if (selectedPaymentMethod === PaymentMethod.CASH) {
              router.push("/profile/bookings");
            } else if (
              selectedPaymentMethod === PaymentMethod.QR_CODE &&
              resPayment.data.status === "redirect"
            ) {
              const { url } = resPayment.data;
              window.location.href = url;
            }
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
      } finally {
        setIsSubmitting(false);
        setIsOpen(false);
        resetForm();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Payment Confirmation"
      className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-7xl max-h-[90vh] 2xl:max-h-screen mx-auto mt-5 outline-none overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/20 flex justify-center items-start z-50 overflow-auto"
    >
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentStep === 1
            ? "Xác nhận thông tin đặt phòng"
            : "Xác nhận thanh toán"}
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 1
                ? "bg-blue-600 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {currentStep === 1 ? "1" : "✓"}
          </div>
          <div
            className={`w-24 h-1 ${
              currentStep === 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentStep === 2
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
        </div>
      </div>

      <form onSubmit={currentStep === 1 ? handleNextStep : handleFinalSubmit}>
        {/* STEP 1: Thông tin đặt phòng */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông tin đặt phòng - Bên trái */}
            <InfoBooking />

            {/* Thông tin người đặt - Bên phải */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white">
                  {isBookingForOther
                    ? "Nhập thông tin người đặt"
                    : "Thông tin người đặt"}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {isBookingForOther ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestInfo.fullName}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
                        placeholder="Trần Thị B"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) =>
                          setGuestInfo({ ...guestInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
                        placeholder="guest@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestInfo.phone}
                        onChange={(e) =>
                          setGuestInfo({ ...guestInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
                        placeholder="0987654321"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        CMND/CCCD <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestInfo.idNumber}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            idNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
                        placeholder="009876543210"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      {
                        label: "Họ và tên",
                        value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
                      },
                      { label: "Email", value: user?.email },
                      { label: "Số điện thoại", value: user?.phone },
                      { label: "CMND/CCCD", value: user?.customer?.idNumber },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-medium text-gray-800">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Checkbox */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div
                    onClick={() => setIsBookingForOther(!isBookingForOther)}
                    className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 flex items-center px-1 ${
                      isBookingForOther ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        isBookingForOther ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <label
                    onClick={() => setIsBookingForOther(!isBookingForOther)}
                    className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    Đặt phòng giúp người khác
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Phương thức thanh toán */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Chọn phương thức thanh toán
              </h3>
              <div>
                <div className="space-y-3">
                  {Object.values(PaymentMethod).map((method) => {
                    const Icon = paymentMethodIcons[method];
                    return (
                      <div
                        key={method}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`p-3 border rounded-lg cursor-pointer flex items-center ${
                          selectedPaymentMethod === method
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-6 w-6 mr-3" />
                        <div>
                          <h4 className="font-medium">
                            {translatepaymentMethodDisplayNames[method]}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {paymentMethodDescriptions[method]}
                          </p>
                        </div>
                        {selectedPaymentMethod === method && (
                          <CheckIcon className="h-6 w-6 text-blue-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tóm tắt đặt phòng */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Tóm tắt đơn đặt phòng
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold">
                    {calculateNights(
                      formData.checkInDate,
                      formData.checkOutDate,
                    )}{" "}
                    đêm
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(formData.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">lưu ý:</p>
                  <div>
                    {" "}
                    <span className="text-yellow-600 font-semibold mr-2">
                      🏖 Mùa cao điểm
                    </span>
                    <span className="text-gray-600 text-sm">
                      Giá có thể cao hơn so với ngày thường
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex justify-between gap-4 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={
              currentStep === 1 ? () => setIsOpen(false) : handlePrevStep
            }
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {currentStep === 1 ? "Hủy" : "Quay lại"}
          </button>
          <button
            type="submit"
            className={`px-6 py-3 ${
              currentStep === 2 && !selectedPaymentMethod
                ? "bg-gray-700 text-white cursor-wait"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }  rounded-lg  transition-colors font-medium`}
            disabled={
              isSubmitting || (currentStep === 2 && !selectedPaymentMethod)
            }
          >
            {isSubmitting
              ? "Đang xử lý..."
              : currentStep === 1
                ? "Tiếp theo"
                : "Xác nhận đặt phòng"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InformationBooking;
