import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
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
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import Mutate from "@/hook/Mutate";

interface DeleteReviewProps {
  id: string; // Assuming you need the review ID to delete it
}
const DeleteReview = ({ id }: DeleteReviewProps) => {
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/api/review/${id}`, {
        withCredentials: true,
      });
      if (!res.data) {
        throw new Error("Failed to delete review");
      }
      Mutate(`${process.env.NEXT_PUBLIC_URL_API}/api/review/all`);
      toast.success("Xóa đánh giá thành công!");
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error(
        error.response?.data?.message || "Xóa đánh giá không thành công"
      );
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" aria-haspopup="dialog">
            <X className="w-5 h-5 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa Đánh Giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteReview;
