import { Button } from "@/components/ui/button";
import axios from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Mutate from "@/hook/Mutate";

interface Room {
  images: { id: string; imageUrl: string }[];
}

interface RoomProps {
  rooms: Room;
}

const ImageToRoom = ({ rooms }: RoomProps) => {
  const MySwal = withReactContent(Swal);
  const handleDeleteImage = async (id: string) => {
    if (rooms.images.length <= 1) {
      toast.error("Phòng phải có ít nhất 1 hình ảnh!");
      return;
    }
    const confirm = MySwal.fire({
      title: "Bạn có muốn xóa hình ảnh này không ?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      icon: "question",
    });

    if ((await confirm).isConfirmed) {
      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_URL_API}/api/room/images/${id}`,
        );

        if (res.data) {
          toast.success("Xóa hình ảnh thành công!");
          Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Xóa hình ảnh thất bại!");
      }
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6  mt-4 ml-9">
      {rooms.images.map((image) => (
        <div key={image.imageUrl} className="flex items-center mb-2 relative ">
          <Image
            alt="ảnh"
            src={image.imageUrl}
            width={70}
            height={70}
            className=" h-28 w-28 mr-2 object-center"
          />
          <Button
            type="button"
            className="absolute -top-1.5 left-24 flex items-center  justify-center w-4 h-6 bg-red-500 rounded-full cursor-pointer hover:bg-red-600"
            onClick={() => handleDeleteImage(image.id)}
          >
            <X className="text-white" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ImageToRoom;
