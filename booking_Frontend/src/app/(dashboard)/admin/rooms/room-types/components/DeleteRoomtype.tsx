/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Mutate from "@/hook/Mutate";

interface IDeleteRoomtype {
  roomTypeId: string;
}

const DeleteRoomtype = ({ roomTypeId }: IDeleteRoomtype) => {
  const MySwal = withReactContent(Swal);

  const handleRemoveRoomtype = async () => {
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
          `${process.env.NEXT_PUBLIC_URL_API}/api/roomtype/${roomTypeId}`
        );
        if (res.data) {
          toast.success("Xóa thành công!");
          Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/roomtype`);
        }
      } catch (error: any) {
        toast.error(error.response.data.message || "lỗi");
      }
    }
  };
  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className="cursor-pointer"
        onClick={handleRemoveRoomtype}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
};

export default DeleteRoomtype;
