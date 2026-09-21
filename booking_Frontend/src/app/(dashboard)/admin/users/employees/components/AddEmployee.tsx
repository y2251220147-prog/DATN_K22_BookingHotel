"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Mutate from "@/hook/Mutate";
import axiosInstance from "@/lib/axios";
import { URL_API } from "@/lib/fetcher";
import { Label } from "@radix-ui/react-label";
import { UserPlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { DEPARTMENTS } from "./UpdateEmployee";

const AddEmployee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    position: "FRONT_DESK",
    department: "FRONT_DESK",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, position: prev.department }));
  }, [formData.department]);

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      position: "FRONT_DESK",
      department: "FRONT_DESK",
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/api/auth/employee`, formData);
      if (res.data) {
        Mutate(`${URL_API}/api/auth/employee`);
        toast.success("Thêm Nhân Viên Thành Công");
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Lỗi");
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus className="h-4 w-4" />
        Thêm nhân viên
      </Button>

      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        className="bg-white rounded-xl shadow-xl w-[90%] max-w-5xl mx-auto mt-32 outline-none overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/30 flex justify-center items-start z-50"
        contentLabel="Thêm nhân viên mới"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-medium text-gray-900">
                Thêm nhân viên mới
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Điền thông tin để tạo tài khoản mới
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitCreate}>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-medium text-gray-500"
                >
                  Họ
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Nguyễn"
                  onChange={handleChange}
                  value={formData.firstName}
                  className="h-13 text-sm bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-medium text-gray-500"
                >
                  Tên
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Văn An"
                  onChange={handleChange}
                  value={formData.lastName}
                  className="h-13 text-sm bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Email & Phone row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-gray-500"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@cty.com"
                  onChange={handleChange}
                  value={formData.email}
                  className="h-13 text-sm bg-gray-50 border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-medium text-gray-500"
                >
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="0901 234 567"
                  onChange={handleChange}
                  value={formData.phone}
                  className="h-13 text-sm bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-gray-500"
              >
                Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                onChange={handleChange}
                value={formData.password}
                className="h-13 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            {/* Department toggle buttons */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-500">
                Phòng ban
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = formData.department === dept.value;
                  return (
                    <button
                      key={dept.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          department: dept.value,
                        }))
                      }
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className={
                          isSelected ? "text-blue-600" : "text-gray-400"
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
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-8 px-4 text-sm"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="h-8 px-4 text-sm flex items-center gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Thêm nhân viên
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddEmployee;
