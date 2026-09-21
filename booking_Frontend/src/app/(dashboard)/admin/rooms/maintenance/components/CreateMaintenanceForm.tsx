"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import Modal from "react-modal";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { X } from "lucide-react";

interface MaintenanceProps {
  roomId: string;
  RoomNumber: string;
}
const CreateMaintenanceForm = ({ roomId, RoomNumber }: MaintenanceProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomId: roomId || "",
    description: "",
    startDate: "",
    endDate: "",
    status: "SCHEDULED",
    cost: "",
    notes: "",
  });
  const router = useRouter();

  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_API}/api/maintenance`
  );
  useEffect(() => {
    Modal.setAppElement("#root");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMaintenance = {
      ...formData,
      id: Date.now(),
    };
    try {
      await mutate(
        async (currentData = []) => {
          const res = await axiosInstance.post(`/api/maintenance`, formData);
          return [...currentData, res.data];
        },
        {
          optimisticData: [...data, newMaintenance],
          rollbackOnError: true,
          revalidate: true,
          populateCache: true,
        }
      );
      toast.success("✅ Tạo phòng thành công!");
      router.push("/admin/rooms/maintenance");
      setFormData({
        roomId: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "SCHEDULED",
        cost: "",
        notes: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "❌ Tạo phòng thất bại!");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-yellow-500 hover:bg-yellow-700 hover:border-yellow-300 transition-all duration-200 "
        onClick={() => setIsOpen(true)}
      >
        <WrenchIcon className="h-4 w-4 text-white" />
      </Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        contentLabel="Create Maintenance Request"
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-20 outline-none "
        overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto"
      >
        <>
          {/* Header */}
          <div className=" bg-gray-50 border-b border-gray-200 *:rounded-t-xl flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 p-3 mx-2 rounded-2xl">
              Tạo yêu cầu bảo trì cho phòng #{RoomNumber}
            </h2>
            <X
              className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Two columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                    placeholder="Ví dụ: Vệ sinh máy lạnh"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                    required
                    min={formData.startDate}
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái *
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="SCHEDULED">Đã lên lịch</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi phí (VND) *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2"
                    placeholder="chi phí bảo trì"
                    required
                    min="0"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    placeholder={`Tên kỹ thuật viên: Nguyễn Văn A
Các vấn đề khác cần lưu ý...`}
                    rows={6}
                    className="w-full p-2 border rounded"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 focus:ring-offset-2 transition-colors duration-200"
              >
                Tạo yêu cầu
              </button>
            </div>
          </form>
        </>
      </Modal>
    </>
  );
};

export default CreateMaintenanceForm;
