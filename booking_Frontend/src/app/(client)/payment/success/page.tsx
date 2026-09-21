"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  useEffect(() => {
    axiosInstance.post(`/api/payment/webhook/payos`, {
      status,
      orderCode,
    });
    const timeout = setTimeout(() => {
      toast.success("Đặt phòng thành công!");
      router.push("/profile/bookings");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thanh Toán Thành Công
      </h1>
      <p className="text-gray-600">...</p>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}
