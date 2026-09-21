import { formatPrice } from "@/lib/formatPrice";
import { Calendar, Coffee } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import {
  formatDate,
  getExcludeDates,
  getHighlightedDates,
} from "@/lib/formatDate";
import InformationBooking from "./InformationBooking";
import { useBookingStore } from "@/hook/useBookingForm";
import { useUserStore } from "@/hook/useUserStore";
import LoginModal from "./LoginModal";

interface RoomBooking {
  room: {
    id: string;
    originalPrice: number;
    currentPrice: number;
    roomType: {
      maxOccupancy: number;
    };
  };
  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;

  seasonPrice: {
    total: number;
    currentPrice: number;
    originalPrice: number;
    displayPrice: number;
  };
}

const FormBooking = ({ seasonPrice, room, handleFormChange }: RoomBooking) => {
  const { formData, setFormData } = useBookingStore();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [discountCode, setDiscountCode] = useState("");

  const [highlightedDates, setHighlightedDates] = useState<
    { [className: string]: Date[] }[]
  >([]);

  const handleOpenModal = () => {
    const { checkInDate, checkOutDate } = formData;

    // Kiểm tra đã chọn ngày chưa
    if (!checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    // Kiểm tra ngày trả phòng sau ngày nhận phòng
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    // Kiểm tra user đã login chưa
    if (!user?.token) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      setIsLogin(true); // bật form login nếu cần
      return;
    }

    // Nếu tất cả điều kiện đúng → mở modal
    setIsOpen(true);
  };

  const { data } = useSWR(`/api/room/${room.id}/booked-dates`);
  const { data: discount } = useSWR(
    discountCode ? `/api/discount?code=${discountCode}` : null,
  );

  function handleDiscountCode() {
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Vui lòng chọn ngày trước!");
      return;
    }

    if (!discountCode) {
      toast.error("Vui lòng nhập mã giảm giá!");
      setFormData({
        discountId: null,
        discountAmount: 0,
        totalAmount: seasonPrice.total,
      });
      return;
    }

    // Kiểm tra data trả về có khớp với mã đang nhập không
    if (
      discount?.data?.percentage &&
      discount?.data?.code === discountCode.toUpperCase()
    ) {
      const discountAmount = Math.round(
        seasonPrice.total * (discount.data.percentage / 100),
      );
      setFormData({
        discountId: discount.data.id,
        discountAmount: discountAmount,
        totalAmount: seasonPrice.total - discountAmount,
      });
      toast.success("Mã giảm giá đã được áp dụng!");
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
      setFormData({
        discountId: null,
        discountAmount: 0,
        totalAmount: seasonPrice.total,
      });
    }
  }

  useEffect(() => {
    if (data) {
      setHighlightedDates(getHighlightedDates(data));
      setBookedDates(getExcludeDates(data));
    }
  }, [data]);

  const handleDateChange = (
    date: Date | null,
    field: "checkInDate" | "checkOutDate",
  ) => {
    setFormData({
      [field]: date,
    });
  };

  return (
    <div>
      <div className="bg-gray-50 py-8 px-4 rounded-xl shadow-md sticky top-6 border border-gray-100 mt-5 ">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Đặt phòng
        </h2>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Chi tiết đặt phòng
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  Ngày nhận *
                </label>
                <DatePicker
                  selected={formData.checkInDate}
                  onChange={(date) => handleDateChange(date, "checkInDate")}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText=" ngày nhận phòng"
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  minDate={new Date()}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-blue-600" />
                  Ngày trả *
                </label>
                <DatePicker
                  selected={formData.checkOutDate}
                  onChange={(date) => handleDateChange(date, "checkOutDate")}
                  excludeDates={bookedDates}
                  highlightDates={highlightedDates}
                  placeholderText=" ngày trả phòng"
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  minDate={
                    formData.checkInDate
                      ? new Date(
                          new Date(formData.checkInDate).getTime() +
                            24 * 60 * 60 * 1000,
                        )
                      : new Date()
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-2 mx-5  items-center gap-6">
              <div className=" flex flex-col xl:flex-row items-center gap-2 mt-1">
                <Square className="w-4 h-4 text-gray-400 bg-gray-400" />
                <span>Đã có người đặt</span>
              </div>
              <div className=" flex flex-col xl:flex-row items-center gap-2 mt-1">
                <Square className="w-4 h-4 text-green-500 bg-green-500" />
                <span>Đã Nhận Phòng</span>
              </div>
            </div>
            {room.roomType.maxOccupancy !== 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng khách
                </label>
                <select
                  name="totalGuests"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleFormChange}
                  value={formData.totalGuests}
                >
                  {[...Array(room.roomType.maxOccupancy)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} người
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Coffee size={16} className="mr-2 text-blue-600" />
                Yêu cầu đặc biệt
              </label>
              <textarea
                name="specialRequests"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                rows={3}
                placeholder="Vui lòng cho chúng tôi biết nhu cầu đặc biệt của bạn"
                onChange={handleFormChange}
                value={formData.specialRequests}
              />
            </div>
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="discount">Mã giảm giá (nếu có)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="discount"
                placeholder="Nhập mã giảm giá"
                value={discountCode.toUpperCase()}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="py-6"
              />{" "}
              <Button
                type="button"
                onClick={handleDiscountCode}
                className="py-6"
              >
                {" "}
                Áp Dụng
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Giá phòng mỗi đêm:</span>
              <span className="font-medium">
                {formatPrice(Number(seasonPrice.displayPrice))}
              </span>
            </div>

            {discount?.data?.percentage && formData.discountId && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Giảm giá ({discount.data.percentage}%):</span>
                <span className="font-medium text-sm">
                  -{" "}
                  {formatPrice(
                    Math.round(
                      seasonPrice.total * (discount.data.percentage / 100),
                    ),
                  )}
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 my-2 pt-2">
              <div className="flex justify-between">
                <span className="font-medium">Tổng cộng:</span>
                <span className="text-blue-600 font-bold">
                  {formatPrice(Number(formData.totalAmount)) || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * Giá chưa bao gồm thuế và phí dịch vụ
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleOpenModal}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Đặt phòng ngay
          </button>

          {formData.checkInDate && formData.checkOutDate ? (
            <p className="text-xs text-gray-500 mt-1 text-center">
              Giá phòng trong khoảng thời gian{" "}
              {formatDate(formData.checkInDate)} -{" "}
              {formatDate(formData.checkOutDate)} được áp dụng theo mùa cao điểm
              (đã bao gồm điều chỉnh mùa vụ).
            </p>
          ) : (
            <p className="text-xs text-center text-gray-500">
              Lưu ý: Giá hiển thị là giá gốc tham khảo cho ngày bắt đầu đặt
              phòng. Giá thực tế của từng đêm có thể thay đổi theo mùa vụ tùy
              theo ngày cụ thể quý khách đặt.
            </p>
          )}
        </form>
      </div>
      {isLogin ? (
        <LoginModal isLogin={isLogin} setIsLogin={setIsLogin} />
      ) : (
        <InformationBooking isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default FormBooking;
