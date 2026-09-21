"use client";

import React, { useMemo } from "react";
import useSWR from "swr"; // Thay vì cài React Query (TanStack), dùng luôn SWR đã có sẵn trong project
import CardStatistical from "../components/statistical/CardStatistical";
import RevenueTotalMonth from "../components/statistical/RevenueTotalMonth";
import CustomerBarChart from "../components/statistical/CustomerBarChart";
import BookingResourceChart from "../components/statistical/BookingResourceChart";
import CalendarBooking from "../components/statistical/CalendaBooking";
import TopRoomStats from "../components/statistical/TopRoomStats";
import axiosInstance from "@/lib/axios";

// Đóng gói tất cả API calls chung cho SWR
const fetchDashboardData = async () => {
  const [resRevenue, resCustomer, resBooking] = await Promise.all([
    axiosInstance.get(`/api/dashboard/revenue-total-month`),
    axiosInstance.get(`/api/dashboard/customer-count-by-month`),
    axiosInstance.get(`/api/dashboard/revenue-online-offline`),
  ]);

  return {
    revenueData: resRevenue.data,
    customerData: resCustomer.data.data,
    bookingResource: resBooking.data.data,
  };
};

const Page = () => {
  const { data, error, isLoading } = useSWR(
    "admin-dashboard-data",
    fetchDashboardData,
    {
      revalidateOnFocus: false, // Tránh fetch lại mỗi lần lướt tab qua lại
    }
  );

  const formattedData = useMemo(() => {
    return (
      data?.bookingResource?.map((item: any) => ({
        name: item.month,
        online: item.online,
        offline: item.offline,
      })) || []
    );
  }, [data?.bookingResource]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 font-semibold animate-pulse">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-lg hover:underline underline-offset-4 cursor-pointer" onClick={() => window.location.reload()}>
          ❌ Có lỗi xảy ra khi tải dữ liệu. Nhấn để thử lại.
        </p>
      </div>
    );
  }

  // Phá huỷ data object an toàn nếu chưa load kịp
  const { revenueData = { months: [], data: [] }, customerData = { months: [], counts: [] } } = data || {};

  return (
    <div className="space-y-6">
      <CardStatistical />

      <CalendarBooking />

      <div className="rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 items-center">
          <RevenueTotalMonth data={revenueData || []} />
          <CustomerBarChart data={customerData || []} />
        </div>
      </div>

      <BookingResourceChart data={formattedData || []} />
      <TopRoomStats />
    </div>
  );
};

export default Page;
