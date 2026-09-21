/* eslint-disable @typescript-eslint/no-explicit-any */
"úse client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

import { PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Mutate from "@/hook/Mutate";

const AddAmenies = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/amenity`,
        formData
      );
      if (res.data) {
        setFormData({
          name: "",
          description: "",
        });
        toast.success("Thêm tiện nghi thành công");
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/amenity`);
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <>
      <Button
        variant={"default"}
        className="mb-4 flex items-center  gap-2 cursor-pointer h-10 px-6 "
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle className="h-7 w-7 " />
        Thêm Tiện Nghi
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Add Amenity"
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-40 outline-none"
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Thêm tiện nghi</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-red-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 " />
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmitCreate}>
            <div className="grid grid-cols-1  gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm font-medium">
                  Tên tiện nghi
                </Label>
                <Input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Nhập tên"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={6}
                  onChange={handleChange}
                  value={formData.description}
                  className="border border-gray-300 rounded-md p-2 w-full resize-none"
                  placeholder="Nhập mô tả tiện nghi..."
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-4 bg-blue-500 text-white rounded-md cursor-pointer "
            >
              Thêm tiện nghi
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default AddAmenies;
