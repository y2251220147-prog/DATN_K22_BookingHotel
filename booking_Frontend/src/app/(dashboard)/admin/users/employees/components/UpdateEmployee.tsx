"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Building2, Hammer, PencilLine, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Employee } from "./TableEmployee";
import { URL_API } from "@/lib/fetcher";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import Mutate from "@/hook/Mutate";

interface IUpdateEmployee {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  employee: Employee | null;
}

export const DEPARTMENTS = [
  {
    value: "FRONT_DESK",
    label: "Lễ tân",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    value: "MAINTENANCE",
    label: "Bảo trì",
    icon: <Hammer className="h-4 w-4" />,
  },
  {
    value: "MANAGEMENT",
    label: "Quản lý",
    icon: <Building2 className="h-4 w-4" />,
  },
];

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Hoạt động",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    value: "INACTIVE",
    label: "Vô hiệu hóa",
    color: "bg-red-50 border-red-200 text-red-700",
  },
];

const UpdateEmployee = ({ isOpen, setIsOpen, employee }: IUpdateEmployee) => {
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    position: "FRONT_DESK",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        phone: employee.phone || "",
        position: employee.employee?.position || "FRONT_DESK",
        status: employee.status || "ACTIVE",
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/api/auth/employee/${employee?.employee?.id}`,
        formData,
      );
      if (res.status === 200) {
        setIsOpen(false);
        Mutate(`${URL_API}/api/auth/employee`);
        toast.success("Cập nhật nhân viên thành công");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Cập nhật nhân viên thất bại";
      toast.error(message);
      console.log(error); // xem lỗi thật sự là gì
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="bg-white rounded-xl shadow-xl w-[90%] max-w-4xl mx-auto mt-32 outline-none overflow-hidden"
      overlayClassName="fixed inset-0 bg-black/30 flex justify-center items-start z-50"
      contentLabel="Chỉnh sửa nhân viên"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <PencilLine className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-gray-900">
              Chỉnh sửa nhân viên
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Cập nhật thông tin nhân viên
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Họ</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="h-13 text-sm bg-gray-50 border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Tên</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="h-13 text-sm bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Email & Phone row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">Email</Label>
              <Input
                name="email"
                type="email"
                value={employee?.email || ""}
                disabled
                className="h-13 text-sm bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">
                Số điện thoại
              </Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-13 text-sm bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Department toggle */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">
              Phòng ban
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {DEPARTMENTS.map((dept) => {
                const isSelected = formData.position === dept.value;
                return (
                  <button
                    key={dept.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, position: dept.value }))
                    }
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={
                        isSelected ? "text-amber-600" : "text-gray-400"
                      }
                    >
                      {dept.icon}
                    </span>
                    {dept.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status toggle */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-500">
              Trạng thái
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const isSelected = formData.status === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: s.value }))
                    }
                    className={`py-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? s.color
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="h-9 px-4 text-sm"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="h-9 px-4 text-sm flex items-center gap-1.5"
          >
            <PencilLine className="h-3.5 w-3.5" />
            Cập nhật nhân viên
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateEmployee;
