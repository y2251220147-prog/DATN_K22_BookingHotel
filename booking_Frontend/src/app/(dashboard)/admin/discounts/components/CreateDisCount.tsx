import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { URL_API } from "@/lib/fetcher";
import Mutate from "@/hook/Mutate";
import axiosInstance from "@/lib/axios";

Modal.setAppElement("#root");

interface DiscountFormData {
  code: string;
  percentage: number;
  validFrom: string;
  validTo: string;
}

const CreateDiscount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DiscountFormData>({
    code: "",
    percentage: 0,
    validFrom: "",
    validTo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/api/discount`, formData);
      if (res.data) {
        Mutate(`${URL_API}/api/discount/getAll`);
        toast.success("Thêm Mã Giảm Giá Thành Công");
        setIsOpen(false);
        setFormData({
          code: "",
          percentage: 0,
          validFrom: "",
          validTo: "",
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message || "Failed to create discount");
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Thêm Mã Giảm Giá</Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[500px]"
        overlayClassName="fixed inset-0 bg-black/30 bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Tạo mã giảm giá</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã Giảm Giá
            </label>
            <input
              type="text"
              name="code"
              min={0}
              value={formData.code.toUpperCase()}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              placeholder="Tạo Một Mã Giảm Giá Bất Kỳ"
            />
          </div>
          <label className="block text-sm font-medium mb-1">Giảm Gía (%)</label>
          <input
            type="number"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full p-2 border rounded-md"
            required
            placeholder="Nhập Giá Trị %"
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày Bắt Đầu
            </label>
            <input
              type="date"
              name="validFrom"
              value={formData.validFrom}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày Kết Thúc
            </label>
            <input
              type="date"
              name="validTo"
              value={formData.validTo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Thêm Mới
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateDiscount;
