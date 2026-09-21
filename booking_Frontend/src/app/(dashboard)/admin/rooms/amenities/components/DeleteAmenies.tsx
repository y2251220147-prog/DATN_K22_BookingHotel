/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { mutate } from "swr";
import Mutate from "@/hook/Mutate";

const DeleteAmenies = ({ id }: { id: string }) => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async () => {
    const confirm = MySwal.fire({
      title: "Bạn có muốn xóa phần này không ?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      icon: "question",
    });
    try {
      if ((await confirm).isConfirmed) {
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_URL_API}/api/amenity/${id}`
        );
        if (res.data) {
          toast.success("Xóa tiện nghi thành công");
          Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/amenity`);
        }
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
        className="hover:text-red-500 cursor-pointer p-1 text-white bg-red-600"
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};

export default DeleteAmenies;
