/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { ImageDownIcon, PlusCircle, X, DollarSign } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Mutate from "@/hook/Mutate";
import { formatPrice } from "@/lib/formatPrice";

type RoomFormData = {
  roomNumber: string;
  floor: number;
  status: string;
  notes: string;
  roomTypeId: string;
  originalPrice: number;
  imageUrls: string[];
};

interface RoomProps {
  data: any[];
}

const CreateRoom = ({ data }: RoomProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: "",
    floor: 1,
    status: "AVAILABLE",
    notes: "",
    roomTypeId: "",
    originalPrice: 0,
    imageUrls: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Chỉ nhận số cho roomNumber
    let processedValue = value;
    if (name === "roomNumber") {
      processedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "floor" || name === "originalPrice"
          ? Number(processedValue)
          : processedValue,
    }));
  };

  const handleRemoveImageIndex = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/room`,
        formData,
      );
      if (res.data) {
        toast.success("Tạo Phòng Thành Công");
        setIsOpen(false);
        setFormData({
          roomNumber: "",
          floor: 1,
          status: "AVAILABLE",
          notes: "",
          roomTypeId: "",
          originalPrice: 0,
          imageUrls: [],
        });
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Lỗi");
    }
  };

  return (
    <>
      <Button
        variant="default"
        className="px-4 py-2.5 mb-2 cursor-pointer flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2.5 font-medium"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle className="h-5 w-5" />
        <span>Thêm phòng mới</span>
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Thêm phòng"
          className="bg-white rounded-2xl shadow-2xl p-8 w-[95%] max-w-5xl mx-auto mt-10 outline-none max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start z-50 p-4"
        >
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thêm phòng mới
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Điền thông tin chi tiết về phòng
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
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
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Ví dụ: 101, 102..."
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
                    <input
                      type="number"
                      name="floor"
                      placeholder="Nhập số tầng"
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
                      {data.map((item: any) => (
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
                      <input
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

              {/* Status - Redesigned */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="w-full px-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-semibold text-green-700 text-sm">
                    SẴN SÀNG
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  placeholder="Nhập thông tin bổ sung về phòng (tùy chọn)..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  Hình ảnh phòng
                </h3>

                {formData.imageUrls.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.imageUrls
                        .filter((url) => url)
                        .map((url, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square"
                          >
                            <Image
                              src={url}
                              alt={`Ảnh phòng ${index + 1}`}
                              fill
                              className="rounded-lg object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-200"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow-lg hover:bg-red-50 hover:shadow-xl transition-all duration-200 p-0 opacity-0 group-hover:opacity-100"
                              onClick={() => handleRemoveImageIndex(index)}
                            >
                              <X className="h-5 w-5 text-red-600" />
                            </Button>
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                      <UploadButton
                        className="w-full max-w-md"
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res.length > 0) {
                            const urls = res.map((file) => file.url);
                            setFormData((prev) => ({
                              ...prev,
                              imageUrls: [...prev.imageUrls, ...urls],
                            }));
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(
                            `Upload failed: ${error.message}` ||
                              "Tải lên không thành công!",
                          );
                        }}
                        content={{
                          button({ isUploading }) {
                            return isUploading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Đang tải lên...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                <span>Thêm ảnh</span>
                              </div>
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group">
                    <UploadButton
                      className="relative"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                          const urls = res.map((file) => file.url);
                          setFormData((prev) => ({
                            ...prev,
                            imageUrls: [...urls, ...prev.imageUrls],
                          }));
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(
                          `Upload failed: ${error.message}` ||
                            "Tải lên không thành công!",
                        );
                      }}
                      content={{
                        button({ isUploading }) {
                          return isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
                              <span className="text-blue-600 font-medium">
                                Đang tải lên...
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <div className=" bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                <ImageDownIcon className="text-blue-600 w-10 h-10" />
                              </div>
                              <div className="text-center">
                                <p className="text-base font-semibold text-gray-700">
                                  Tải ảnh phòng lên
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  PNG, JPG, GIF tối đa 4MB
                                </p>
                              </div>
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setFormData({
                      roomNumber: "",
                      floor: 1,
                      status: "AVAILABLE",
                      notes: "",
                      roomTypeId: "",
                      originalPrice: 0,
                      imageUrls: [],
                    });
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Thêm phòng
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateRoom;
