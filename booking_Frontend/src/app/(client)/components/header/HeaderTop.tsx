"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AccountUser from "./AccountUser";
import { useUserStore } from "@/hook/useUserStore";

const HeaderTop = () => {
  const { user, initUser } = useUserStore();
  const [mounted, setMounted] = useState(false);

  // Giải quyết triệt để lỗi Hydration: Đợi Client render xong xuôi mới đưa Zustand vào DOM
  useEffect(() => {
    setMounted(true);
    initUser();
  }, [initUser]);

  return (
    <div className="h-8 bg-black shadow-md">
      <div className="container mx-auto px-4 md:px-8 lg:px-52">
        <div className="flex justify-center lg:justify-between items-center h-full text-white">
          <div className="hidden lg:block text-xs md:text-sm font-medium tracking-wide mt-2">
            Chào Mừng Bạn Đến Với Khách Sạn Của Chúng Tôi
          </div>

          <div className="flex items-center space-x-4 text-sm mt-2">
            {!mounted ? (
              // Lúc Server đang render (hydration), hiển thị khoảng trống ảo để giữ chỗ, chống vỡ Layout
              <div className="w-32 h-4"></div>
            ) : user ? (
              <AccountUser userType={user.userType} lastName={user.lastName} />
            ) : (
              <div className="flex items-center space-x-4">
                {/* Ở Next.js, KHÔNG ĐƯỢC bọc thẻ <button> bên trong thẻ <Link>. Sẽ sinh lỗi HTML nặng. */}
                <Link
                  href={"/signIn"}
                  className="hover:text-yellow-200 transition-colors duration-200 hover:cursor-pointer"
                >
                  Đăng Nhập
                </Link>
                <div className="h-4 border-r border-white" />
                <Link
                  href={"/signUp"}
                  className="hover:text-yellow-200 transition-colors duration-200 hover:cursor-pointer"
                >
                  Đăng Kí
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
