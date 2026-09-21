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
import toast from "react-hot-toast";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import Mutate from "@/hook/Mutate";

interface RemoveBookingProps {
  bookingId: string;
  paymentMethod: string;
}

const RemoveBooking = ({ bookingId, paymentMethod }: RemoveBookingProps) => {
  const handleRemoveBooking = async () => {
    try {
      const res = await axiosInstance.delete(`/api/booking/${bookingId}`);
      if (res.data) {
        toast.success("Đơn đặt phòng đã được hủy thành công");
        Mutate("/api/booking/bookingUser");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn");
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer hover:text-red-500"
        >
          <X className="h-4 w-4 mr-2 " />
          Hủy phòng
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn hủy đặt phòng?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Đơn đặt phòng sẽ bị hủy vĩnh viễn.
            {paymentMethod === "QR_CODE" && (
              <>
                <br />
                <span className="text-orange-600 font-medium">Lưu ý:</span> Nếu
                bạn đã thanh toán qua QR, vui lòng liên hệ{" "}
                <Link
                  href={"https://web.facebook.com/tncuong2004/"}
                  className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-500"
                >
                  lễ tân
                </Link>{" "}
                để được hỗ trợ theo chính sách của khách sạn.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemoveBooking}
            className="cursor-pointer"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemoveBooking;
