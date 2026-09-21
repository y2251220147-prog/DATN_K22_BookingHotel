/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageDownIcon, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import AddAmenityToRoomtype from "./AddAmenityToRoomtype";
import { UploadButton } from "@/utils/uploadthing";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import DeleteAmenityToRoomtype from "./DeleteAmenityToRoomtype";
import Mutate from "@/hook/Mutate";
interface RoomType {
  id: string;
  name: string;
  description: string;

  maxOccupancy: number;
  photoUrls?: string;
  amenities: {
    amenity: { id: string; name: string };
  }[];
}
interface MockRoomType {
  roomTypes: RoomType;
}

const UpdateRoomType = ({ roomTypes }: MockRoomType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<null | string>(null);
  const [formData, setFormData] = useState({
    name: roomTypes.name,
    description: roomTypes.description,
    maxOccupancy: Number(roomTypes.maxOccupancy || 0),
    photoUrls: roomTypes.photoUrls,
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
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  useEffect(() => {
    if (roomTypes.photoUrls) {
      setImage(roomTypes.photoUrls);
    }
  }, [roomTypes.photoUrls]);

  const roomTypeAmenities = roomTypes.amenities.map((item) => item.amenity.id);
  const resetForm = () => {
    setIsOpen(false);
    setFormData({
      name: roomTypes.name,
      description: roomTypes.description,
      maxOccupancy: Number(roomTypes.maxOccupancy || 0),
      photoUrls: roomTypes.photoUrls,
    });
    setImage(roomTypes.photoUrls || null);
  };

  const handleUpdateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype/${roomTypes.id}`,
        formData,
      );
      if (res.data) {
        toast.success("Cập nhật loại phòng thành công!");
        setIsOpen(false);
        Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/roomtype`);
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || "Cập nhật loại phòng thất bại!",
      );
      console.log(error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer  bg-blue-500"

        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4 text-white" />
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
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form className="space-y-6" onSubmit={handleUpdateRoomType}>
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
                    rows={8}
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
                      value={formData.maxOccupancy || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right column - Photos and amenities */}
              <div className="space-y-4 relative">
                {image ? (
                  <div className="flex items-center justify-center ">
                    <Image
                      width={400}
                      height={400}
                      src={image || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-lg h-auto  object-cover rounded-lg shadow-md"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-3 cursor-pointer text-red-500 hover:text-red-600 shadow-md"
                      onClick={() => {
                        setImage(null);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4 h-[200px] ">
                    {" "}
                    <UploadButton
                      className=" text-black py-2 px-4 rounded cursor-pointer text-2xl w-60 h-20 border-2 border-dashed border-black hover:bg-black/10 z-20"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          setImage(res[0].ufsUrl);
                          setFormData((prev) => ({
                            ...prev,
                            photoUrls: res[0].ufsUrl,
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
                    <AddAmenityToRoomtype
                      roomTypeId={roomTypes.id}
                      roomTypeAmenities={roomTypeAmenities}
                    />
                  </div>
                  <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {roomTypes.amenities.map((amenity) => (
                        <div
                          key={amenity.amenity.id}
                          className="flex items-center justify-between gap-2 bg-gray-50 rounded-md px-3 py-1.5"
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {amenity.amenity.name}
                          </span>
                          <DeleteAmenityToRoomtype
                            amenityId={amenity.amenity.id}
                            roomTypeId={roomTypes.id}
                          />
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
                onClick={resetForm}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
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

export default UpdateRoomType;
