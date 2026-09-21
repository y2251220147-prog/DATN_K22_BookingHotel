/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Pencil, X, DollarSign, Check, Clock, Wrench } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import AddImageToRoom from "./AddImageToRoom";
import ImageToRoom from "./DeleteImageToRoom";
import Mutate from "@/hook/Mutate";
import { formatPrice } from "@/lib/formatPrice";

interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  notes: string;
  roomTypeId: string;
  originalPrice: number;
  images: { id: string; imageUrl: string }[];
}

interface RoomProps {
  data: any[];
  rooms: Room;
}

const UpdateRoom = ({ data, rooms }: RoomProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    roomNumber: rooms.roomNumber || "",
    floor: rooms.floor,
    status: rooms.status,
    notes: rooms.notes,
    roomTypeId: rooms.roomTypeId,
    originalPrice: Number(rooms.originalPrice) || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "floor" || name === "originalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/api/room/${rooms.id}`,
        formData,
      );
      if (res.data) {
        toast.success("Cập nhật thành công!");
        setIsOpen(false);
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Cập nhật không thành công!");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer bg-blue-500 hover:bg-blue-600 hover:border-blue-300 transition-all duration-200 "
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4 text-white" />
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Cập nhật phòng"
          className="bg-white rounded-2xl shadow-2xl p-8 w-[95%] max-w-5xl mx-auto mt-10 outline-none max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start z-50 p-4"
        >
          <div>
            {/* Header with Room Image */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {rooms.images && rooms.images.length > 0 && (
                  <div className="relative">
                    <Image
                      alt="Room thumbnail"
                      src={rooms.images[0].imageUrl}
                      width={80}
                      height={80}
                      className="rounded-xl h-20 w-20 object-cover border-2 border-gray-200 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      #{rooms.roomNumber}
                    </div>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cập nhật phòng #{rooms.roomNumber}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Chỉnh sửa thông tin chi tiết
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số phòng <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* Floor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tầng <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      required
                    />
                  </div>

                  {/* Room Type ID */}
                  <div>
                    <label
                      htmlFor="roomTypeId"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Loại phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="roomTypeId"
                      name="roomTypeId"
                      value={formData.roomTypeId}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                      required
                    >
                      <option value="" disabled>
                        Chọn loại phòng
                      </option>
                      {data.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá gốc <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        name="originalPrice"
                        placeholder="0"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                        required
                      />
                    </div>
                    {formData.originalPrice > 0 && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        {formatPrice(formData.originalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Section - Enhanced Design */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  Trạng thái phòng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Available */}
                  <label
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${formData.status === "AVAILABLE"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="AVAILABLE"
                      checked={formData.status === "AVAILABLE"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${formData.status === "AVAILABLE"
                          ? "bg-green-100"
                          : "bg-gray-100"
                          }`}
                      >
                        <Check
                          className={`h-5 w-5 ${formData.status === "AVAILABLE"
                            ? "text-green-600"
                            : "text-gray-400"
                            }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${formData.status === "AVAILABLE"
                            ? "text-green-700"
                            : "text-gray-700"
                            }`}
                        >
                          Sẵn sàng
                        </p>
                        <p className="text-xs text-gray-500">Có thể đặt</p>
                      </div>
                    </div>
                  </label>

                  {/* Occupied */}
                  <label
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${formData.status === "OCCUPIED"
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="OCCUPIED"
                      checked={formData.status === "OCCUPIED"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${formData.status === "OCCUPIED"
                          ? "bg-amber-100"
                          : "bg-gray-100"
                          }`}
                      >
                        <Clock
                          className={`h-5 w-5 ${formData.status === "OCCUPIED"
                            ? "text-amber-600"
                            : "text-gray-400"
                            }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${formData.status === "OCCUPIED"
                            ? "text-amber-700"
                            : "text-gray-700"
                            }`}
                        >
                          Đang sử dụng
                        </p>
                        <p className="text-xs text-gray-500">Có khách</p>
                      </div>
                    </div>
                  </label>

                  {/* Maintenance */}
                  <label
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${formData.status === "MAINTENANCE"
                      ? "border-red-500 bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="MAINTENANCE"
                      checked={formData.status === "MAINTENANCE"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${formData.status === "MAINTENANCE"
                          ? "bg-red-100"
                          : "bg-gray-100"
                          }`}
                      >
                        <Wrench
                          className={`h-5 w-5 ${formData.status === "MAINTENANCE"
                            ? "text-red-600"
                            : "text-gray-400"
                            }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${formData.status === "MAINTENANCE"
                            ? "text-red-700"
                            : "text-gray-700"
                            }`}
                        >
                          Bảo trì
                        </p>
                        <p className="text-xs text-gray-500">Đang sửa chữa</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Nhập thông tin bổ sung về phòng (tùy chọn)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                />
              </div>

              {/* Image Management Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  Quản lý hình ảnh
                </h3>
                <div className="space-y-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <ImageToRoom rooms={rooms} />
                  <AddImageToRoom roomId={rooms.id} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdateRoom;
