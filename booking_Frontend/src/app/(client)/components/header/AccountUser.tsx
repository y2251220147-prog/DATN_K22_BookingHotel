import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useUserStore } from "@/hook/useUserStore";

interface AccountUserProps {
  userType: string | null;
  lastName: string | null;
}
const AccountUser = ({ userType, lastName }: AccountUserProps) => {
  const { logout } = useUserStore(); // lấy user global từ store

  return (
    <div className="flex justify-start">
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer flex items-center gap-1">
          <span className="text-start">
            Tài Khoản của {lastName ? lastName : "Bạn"}
          </span>
          <ChevronDown size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Thông Tin Tài Khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userType === "EMPLOYEE" || userType === "ADMIN" ? (
            <Link href="/admin">
              <DropdownMenuItem className="hover:text-yellow-600 transition-colors duration-100">
                Quản Lý
              </DropdownMenuItem>
            </Link>
          ) : (
            <>
              <Link href="/profile">
                <DropdownMenuItem>Thông Tin</DropdownMenuItem>
              </Link>
              <Link href="/profile/bookings">
                <DropdownMenuItem>Đơn Đặt Phòng</DropdownMenuItem>
              </Link>
            </>
          )}

          <DropdownMenuItem onClick={logout}>Đăng Xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AccountUser;
