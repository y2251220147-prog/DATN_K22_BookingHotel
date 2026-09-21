/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageDownIcon, PlusCircle, X } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import toast from "react-hot-toast";
import Mutate from "@/hook/Mutate";

interface Amenity {
  id: string;
  name: string;
}
const CreateRoomtype = () => {
  const { data } = useSWR(`/api/amenity`);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<undefined | string>(undefined);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAmenities((prev) => [...prev, value]);
    } else {
      setSelectedAmenities((prev) =>
        prev.filter((amenityId) => amenityId !== value),
      );
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxOccupancy: 0,
    photoUrls: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "originalPrice" || name === "maxOccupancy"
          ? Number(value)
          : value,
    }));
  };

  const handleCreateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype`,
        formData,
      );
      if (res.data) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype/${res.data.roomType.id}/amenities`,
          {
            amenityIds: selectedAmenities,
          },
        );

        toast.success("Thêm loại phòng thành công!");
        setIsOpen(false);
        setImage("");
        setFormData({
          name: "",
          description: "",
          maxOccupancy: 0,
          photoUrls: "",
        });
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/roomtype`);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Thêm loại phòng thất bại!");
    }
  };
  return (
    <>
      <Button
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        Thêm Loại Phòng
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          contentLabel="Cập nhật loại phòng"
          className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-20 outline-none"
          overlayClassName="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-start z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold"></h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleCreateRoomType}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên loại phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    rows={6}
                    onChange={handleChange}
                    className="w-full border p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxOccupancy">
                      Số người tối đa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="maxOccupancy"
                      name="maxOccupancy"
                      type="number"
                      min="1"
                      value={Number(formData.maxOccupancy) || 0}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Photos and amenities */}
              <div className="space-y-4 relative">
                {image ? (
                  <div className="flex items-center justify-center ">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-64  object-contain rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-[200px] ">
                    {" "}
                    <UploadButton
                      className=" text-black py-2 px-4 rounded cursor-pointer text-2xl w-60 h-20 border-2 border-dashed border-black hover:bg-black/10 z-20"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          const url = res[0].ufsUrl;
                          setImage(url);
                          setFormData((prev) => ({
                            ...prev,
                            photoUrls: url,
                          }));
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(
                          `Upload failed. ${error.message}` ||
                            "Tải lên không thành công!",
                        );
                      }}
                      content={{
                        button({ isUploading }) {
                          return isUploading ? (
                            <div className="text-black text-xs">
                              Đang tải lên...
                            </div>
                          ) : (
                            <>
                              <ImageDownIcon className="text-black w-8 h-8" />
                            </>
                          );
                        },
                      }}
                    />
                    <p className="absolute top-6 text-black text-lg ">
                      Up Ảnh Tại Đây
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Tiện nghi</Label>{" "}
                    {/* <AddAmenityToRoomtype
                      roomTypeId={roomTypes.id}
                      roomTypeAmenities={roomTypeAmenities}
                    /> */}
                  </div>
                  <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <div className="space-y-2 grid grid-cols-2">
                      {data?.data?.amenity.map((amenity: Amenity) => (
                        <div key={amenity.id} className=" space-x-2">
                          <div className="text-sm text-gray-700 flex items-center space-x-2">
                            <input
                              onChange={handleCheckboxChange}
                              type="checkbox"
                              value={amenity.id}
                              name={amenity.name}
                            />
                            <span>{amenity.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                className="text-white bg-red-500 hover:bg-red-600 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  setImage("");
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                Thêm mới
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default CreateRoomtype;
