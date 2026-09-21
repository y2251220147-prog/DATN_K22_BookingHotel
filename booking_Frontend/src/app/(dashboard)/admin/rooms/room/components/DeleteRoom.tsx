/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Mutate from "@/hook/Mutate";
interface DeleteRoomProps {
  roomId: string;
}
const DeleteRoom = ({ roomId }: DeleteRoomProps) => {
  const MySwal = withReactContent(Swal);
  const handleDelete = async () => {
    const confirm = MySwal.fire({
      title: "Bạn có muốn xóa Phòng này không ?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      icon: "question",
    });
    if ((await confirm).isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/api/room/${roomId}`);
        if (res.data) {
          toast.success("Xóa thành công!");
          Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/room`);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Xóa không thành công!");
      }
    }
  };
  return (
    <>
      {" "}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="cursor-pointer bg-red-500 hover:bg-red-600 hover:border-red-300 transition-all duration-200 "
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4 text-white" />
      </Button>
    </>
  );
};

export default DeleteRoom;
