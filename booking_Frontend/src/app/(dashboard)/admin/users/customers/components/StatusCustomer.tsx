import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Mutate from "@/hook/Mutate";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import { MoreHorizontalIcon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

interface StatusCustomerProps {
  userId: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}
const StatusCustomer = ({ userId, status }: StatusCustomerProps) => {
  const handleDisable = async () => {
    try {
      const res = await axios.put(
        `${URL_API}/api/auth/disabled/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        toast.success(
          `${status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"} thành công!`
        );
        Mutate(`${URL_API}/api/auth/customer`);
      }
    } catch (error: any) {
      console.log(error);

      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái người dùng.");
    }
  };
  return (
    <div className="text-center ml-6">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontalIcon className="w-5 h-5 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleDisable}>
            {status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatusCustomer;
