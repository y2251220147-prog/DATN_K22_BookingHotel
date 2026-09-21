import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Mutate from "@/hook/Mutate";
import axiosInstance from "@/lib/axios";
import { Trash } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const DeleteMaintenance = ({ id }: { id: string }) => {
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/api/maintenance/${id}`);

      if (!res.data) {
        throw new Error("Failed to delete maintenance");
      }
      Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/maintenance`);
      toast.success(" hủy bảo trì thành công!");
    } catch (error: any) {
      console.error("Error deleting maintenance:", error.response.data.message);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          aria-haspopup="dialog"
          className="bg-red-500 hover:bg-red-700 hover:border-red-300 transition-all duration-200 "
        >
          <Trash className="w-5 h-5 text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa Bảng Ghi</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa Dữ liệu này không ? Hành động này không
            thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenance;
