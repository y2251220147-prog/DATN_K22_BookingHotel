"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/hook/useUserStore";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initUser, user } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Sync state mounted để tránh lỗi SSR/Hydration
  useEffect(() => {
    setMounted(true);
    initUser(); // Gọi initUser ngay sau khi mount để load token từ local
  }, [initUser]);

  function getTokenRemainingTime(token: string | null): number {
    if (!token || typeof token !== "string") return 0;
    try {
      // jwt-decode v4 trả về payload trực tiếp
      const decoded = jwtDecode<{ exp: number }>(token);
      if (!decoded || !decoded.exp) return 0;

      const remaining = decoded.exp * 1000 - Date.now();
      return remaining > 0 ? remaining : 0;
    } catch (e) {
      console.error("Token không hợp lệ hoặc hết hạn:", e);
      return 0;
    }
  }

  useEffect(() => {
    if (!mounted) return;

    let timer: ReturnType<typeof setTimeout>;

    const handleToken = async () => {
      // Lấy token từ localStorage hoặc store
      const token = localStorage.getItem("token") || user?.token;

      if (!token) {
        console.log("❌ Không có token (chưa đăng nhập)");
        return;
      }

      const remainingTime = getTokenRemainingTime(token);
      console.log("⏱ Token còn lại:", Math.round(remainingTime / 1000), "giây");

      // Nếu còn dưới 10 giây (hoặc đã hết) thì refresh
      if (remainingTime <= 10000) {
        console.log("🔄 Token sắp hết hạn → đang refresh...");
        try {
          const newToken = await refreshAccessToken();
          console.log("✅ Refresh token thành công");
          initUser();

          const newRemaining = getTokenRemainingTime(newToken);
          timer = setTimeout(handleToken, Math.max(newRemaining - 5000, 30000));
        } catch (err: any) {
          console.error("❌ Refresh token thất bại:", err?.message || err);
          // Nếu lỗi refresh -> Logout
          localStorage.removeItem("token");
          // Chỉ redirect nếu đang ở trang cần login (tùy logic app)
          router.push("/signIn");
        }
      } else {
        // Hẹn giờ check lại trước khi hết hạn 5 giây
        timer = setTimeout(handleToken, remainingTime - 5000);
      }
    };

    handleToken();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mounted, user?.token, initUser, router]);

  // Vẫn return children để không block UI, nhưng logic bên trong chỉ chạy ở client
  return <>{children}</>;
}
