/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import axios from "axios";
import { X } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Mutate from "@/hook/Mutate";
interface DeleteRoomtypeProps {
  roomTypeId: string;
  amenityId: string;
}
const DeleteAmenityToRoomtype = ({
  amenityId,
  roomTypeId,
}: DeleteRoomtypeProps) => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async () => {
    const confirm = MySwal.fire({
      title: "Bạn có muốn xóa tiện nghi này không ?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      icon: "question",
    });
    if ((await confirm).isConfirmed) {
      try {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype/${roomTypeId}/amenities`,
          {
            data: { amenityId },
          }
        );
        if (res.data) {
          toast.success("Xóa thành công!");
          Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/roomtype`);
        }
      } catch (error: any) {
        toast.error(error.response.data.message || "Xóa không thành công!");
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className=" cursor-pointer"
      >
        <X className="text-red-500 hover:text-red-600" />
      </Button>
    </>
  );
};

export default DeleteAmenityToRoomtype;
