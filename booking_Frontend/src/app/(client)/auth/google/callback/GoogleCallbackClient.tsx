"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "@/hook/useUserStore";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useUserStore();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.replace("/signIn?error=missing_token");
      return;
    }

    localStorage.setItem("token", token);

    const decoded: any = jwtDecode(token);
    login({
      id: decoded.id,
      lastName: decoded.lastName,
      userType: decoded.userType,
      token,
      role: decoded.role || "",
    });

    if (decoded.userType === "EMPLOYEE" || decoded.userType === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/");
    }
  }, [params, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang đăng nhập bằng Google...
    </div>
  );
}
