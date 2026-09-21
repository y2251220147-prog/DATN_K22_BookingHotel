"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getUser } from "@/lib/getUser";

export default function useAuth(
  expectedRole?: ("CUSTOMER" | "EMPLOYEE" | "ADMIN")[]
) {
  const router = useRouter();

  // Dùng SWR để fetch thông tin User:
  // - Lợi ích to lớn 1: Component Header, Sidebar, Layout dù có cùng gọi useAuth đi nữa 
  //   thì SWR sẽ TỰ ĐỘNG GỘP (deduplication) thành duy nhất 1 Request lên Backend.
  // - Lợi ích to lớn 2: Auto Cache. Sang trang khác có useAuth sẽ ăn Cache, 0s loading chớp nhoáng.
  const { data: user, error, isLoading } = useSWR("auth-user-profile", getUser, {
    shouldRetryOnError: false, // Nếu 401 thì không lặp lại request nài nỉ
    revalidateOnFocus: false,
  });

  // Chuyển mảng thành string để tránh lặp vô hạn useEffect do array tham chiếu liên tục thay đổi
  const rolesString = expectedRole?.join(",") || "";

  useEffect(() => {
    // Đợi SWR xác nhận nạp xong
    if (!isLoading) {
      if (!localStorage.getItem("token")) {
        router.push("/");
        return;
      }

      if (error || !user) {
        router.push("/");
        return;
      }

      if (expectedRole && !expectedRole.includes(user.userType)) {
        router.push("/");
        return;
      }
    }
  }, [user, error, isLoading, router, rolesString]);

  // Giữ nguyên return để tương thích 100% với các Component cũ đang dùng
  return { user, loadingLog: isLoading };
}
