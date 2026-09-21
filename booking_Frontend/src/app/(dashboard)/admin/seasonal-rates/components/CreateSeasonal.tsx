"use client";
import axiosInstance from "@/lib/axios";
import { formatPrice } from "@/lib/formatPrice";
import { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import useSWR from "swr";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { SEASON_OPTIONS } from "./seasons";
import SelectRooms from "./SelectRooms";

interface SeasonalRateForm {
  startDate: Date | null;
  endDate: Date | null;
  seasonName: string;
  multiplier: number;
  roomIds: string[];
}

interface RoomType {
  roomType: {
    id: string;
    name: string;
  }[];
}

export default function AddSeasonalRate() {
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<SeasonalRateForm>({
    startDate: null,
    endDate: null,
    seasonName: "",
    multiplier: 1.0,
    roomIds: selectedRoomIds,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const route = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "multiplier" ? Number(value) : value,
    }));
  };
  const handleRoomsChange = (ids: string[]) => {
    setSelectedRoomIds(ids);
    setFormData((prev) => ({
      ...prev,
      roomIds: ids, // cập nhật formData luôn
    }));
  };

  const { data } = useSWR("/api/room?limit=10&page=1");

  const validateForm = (): boolean => {
    if (!formData.seasonName) {
      setError("Vui lòng chọn tên mùa");
      return false;
    }
    if (!formData.startDate) {
      setError("Vui lòng chọn ngày bắt đầu");
      return false;
    }
    if (!formData.endDate) {
      setError("Vui lòng chọn ngày kết thúc");
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }
    if (formData.multiplier < 0.1 || formData.multiplier > 10) {
      setError("Hệ số giá phải từ 0.1 đến 10");
      return false;
    }
    if (!formData.roomIds) {
      setError("Vui lòng chọn  phòng");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log("Submitting form data:", formData);

    try {
      const response = await axiosInstance.post("/api/seasonal", formData);

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          startDate: null,
          endDate: null,
          seasonName: "",
          multiplier: 1.0,
          roomIds: [],
        });
        route.push("/admin/seasonal-rates");
      } else {
        setError("Thêm giá theo mùa thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Lỗi không xác định. Vui lòng thử lại.";

      setError(errorMessage);
      console.log("API error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-4 ">
      <div className="">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className=" text-lg md:text-3xl font-bold text-white">
              Thêm Giá Theo Mùa
            </h1>
            <p className="text-blue-100 mt-2">
              Thiết lập giá phòng đặc biệt cho các mùa cao điểm và sự kiện
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-green-700 font-medium">
                    Thêm giá theo mùa thành công!
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Season Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Mùa <span className="text-red-500">*</span>
                </label>
                <select
                  name="seasonName"
                  value={formData.seasonName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                >
                  <option value="">-- Chọn mùa --</option>
                  {SEASON_OPTIONS.map((season) => (
                    <option key={season.value} value={season.value}>
                      {season.icon} {season.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Bắt Đầu <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg  focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors bg-white">
                    {" "}
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày bắt đầu"
                      className="w-full px-4 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Kết Thúc <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg  focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors bg-white">
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) =>
                        setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày kết thúc"
                      className="w-full px-4 py-3 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Room  */}

              <SelectRooms
                data={data?.room?.data || []}
                onChange={handleRoomsChange}
                value={formData.roomIds}
                label="Chọn Phòng"
                placeholder="Chọn một hoặc nhiều phòng..."
              />

              {/* Multiplier */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hệ Số Giá <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="multiplier"
                    value={formData.multiplier}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0.1"
                    max="10"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <div className="absolute right-4 top-3 text-gray-500 text-sm">
                    ×
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Hệ số từ 0.1 đến 10. Ví dụ: 1.5 = tăng 50%, 0.8 = giảm 20%
                </p>
              </div>

              {/* Price Preview */}
              {/* {formData.multiplier > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Ví Dụ Tính Giá:
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      Giá gốc {formatPrice(selectRoomtype?.originalPrice || 0)}{" "}
                      → Giá mùa:{" "}
                      <span className="font-bold">
                        {calculatePriceExample(
                          selectRoomtype?.originalPrice || 0
                        )}
                        đ
                      </span>
                    </p>
                  </div>
                </div>
              )} */}

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Giá theo mùa sẽ ghi đè giá cơ bản trong khoảng thời gian
                        đã chọn
                      </li>
                      <li>
                        Kiểm tra kỹ ngày tháng để tránh trùng lặp với các mùa
                        khác
                      </li>
                      <li>Hệ số giá sẽ được nhân với giá gốc của phòng</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "💾 Lưu Giá Theo Mùa"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      startDate: null,
                      endDate: null,
                      seasonName: "",
                      multiplier: 1.0,
                      roomIds: [],
                    });
                    setError("");
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  🔄 Làm Mới
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            📖 Hướng Dẫn Sử Dụng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Các Mùa Phổ Biến:
              </h3>
              <ul className="space-y-1">
                <li>• Tết Nguyên Đán: Hệ số 1.8 - 2.5</li>
                <li>• Hè Cao Điểm: Hệ số 1.5 - 2.0</li>
                <li>• Cuối Tuần: Hệ số 1.2 - 1.5</li>
                <li>• Mùa Thấp Điểm: Hệ số 0.7 - 0.9</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Mẹo Định Giá:
              </h3>
              <ul className="space-y-1">
                <li>• Phân tích giá đối thủ cạnh tranh</li>
                <li>• Xem xét tỷ lệ lấp đầy phòng</li>
                <li>• Điều chỉnh theo sự kiện địa phương</li>
                <li>• Cập nhật thường xuyên theo nhu cầu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
