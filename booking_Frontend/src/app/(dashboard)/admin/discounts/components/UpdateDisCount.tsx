import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { IDiscount } from "../page";
import Modal from "react-modal";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import toast from "react-hot-toast";
import Mutate from "../../../../../hook/Mutate";

interface IUpdateDC {
  discounts: IDiscount;
}
Modal.setAppElement("#root");

const UpdateDisCount = ({ discounts }: IUpdateDC) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: discounts.code,
    percentage: discounts.percentage,
    validFrom: discounts.validFrom,
    validTo: discounts.validTo,
  });

  useEffect(() => {
    if (discounts) {
      setFormData({
        ...formData,
        code: discounts.code || "",
        percentage: discounts.percentage || 0,
        validFrom: discounts.validFrom ? discounts.validFrom.split("T")[0] : "",
        validTo: discounts.validTo ? discounts.validTo.split("T")[0] : "",
      });
    }
  }, [discounts]);

  const submitHandleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${URL_API}/api/discount/${discounts.id}`,
        formData,
        { withCredentials: true }
      );
      if (res?.data) {
        toast.success("Đã Thay Đổi Thông Tin");
        setIsOpen(false);
        Mutate(`${URL_API}/api/discount`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message || "Lỗi thay Đổi Thông Tin");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? parseInt(value) : value,
    }));
  };

  return (
    <>
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Edit className="h-20 w-20 text-blue-500 hover:text-blue-600  " />
      </Button>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[500px]"
        overlayClassName="fixed inset-0 bg-black/30 bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4">Tạo mã giảm giá</h2>
        <form className="space-y-4" onSubmit={submitHandleUpdate}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã Giảm Giá
            </label>
            <input
              type="text"
              name="code"
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
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UpdateDisCount;
