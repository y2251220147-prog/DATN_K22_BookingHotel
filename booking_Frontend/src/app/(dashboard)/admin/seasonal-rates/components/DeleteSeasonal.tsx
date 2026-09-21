// components/DeleteSeasonal.tsx
"use client";

import { useState } from "react";
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

import { Trash2, Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import Mutate from "../../../../../hook/Mutate";
import { URL_API } from "@/lib/fetcher";

interface DeleteSeasonalProps {
  id: string;
}

export default function DeleteSeasonal({ id }: DeleteSeasonalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    // Toast loading
    const loadingToast = toast.loading("Đang xóa seasonal rate...");

    try {
      await axiosInstance.delete(`/api/seasonal/${id}`);
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Toast success
      toast.success("Xóa thành công!");
      Mutate(`${URL_API}/api/seasonal`);
      setOpen(false);
    } catch {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Toast error
      toast.error("Xóa thất bại!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
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
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            Xác nhận xóa
          </AlertDialogTitle>
          <span className="text-base">
            Bạn có chắc chắn muốn xóa seasonal rate này không?
          </span>
          <AlertDialogDescription className="space-y-2 pt-2 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-600 flex-shrink-0 mt-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-amber-800">
              <span className="font-semibold">Cảnh báo:</span> Hành động này
              không thể hoàn tác!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
