/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import Mutate from "@/hook/Mutate";

interface IUpdateAmenies {
  id: string;
  name: string;
  description: string;
}
interface IUpdateAmeniesProps {
  amenities: IUpdateAmenies;
}
const UpdateAmenies = ({ amenities }: IUpdateAmeniesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: amenities.name,
    description: amenities.description,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/api/amenity/${amenities.id}`,
        formData
      );
      if (res.data) {
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/amenity`);
        toast.success("Cập nhật tiện nghi thành công");
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Đã xảy ra lỗi");
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-blue-500 cursor-pointer text-white p-1 bg-blue-600"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4 " />
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
            <h2 className="text-xl font-bold">Cập Nhật Tiện Nghi</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-red-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 " />
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
            <div className="flex justify-end gap-6 items-center mt-4">
              <Button
                type="button"
                className="w-fit h-10 mt-4 bg-red-500  text-white rounded-md cursor-pointer "
                onClick={() => setIsOpen(false)}
                variant="outline"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="w-fit h-10 mt-4 bg-blue-500 text-white rounded-md cursor-pointer "
              >
                Cập Nhật
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UpdateAmenies;
