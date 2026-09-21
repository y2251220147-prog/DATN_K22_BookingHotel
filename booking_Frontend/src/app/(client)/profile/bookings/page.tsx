"use client";
import React, { useState, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { Package } from "lucide-react";
import { Booking } from "../components/profileBooking";
import { URL_API } from "@/lib/fetcher";
import BookingCard from "../components/UserBooking";

// ── Tab Config ──────────────────────────────────────────────────────────────
const TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "CHECKED_IN", label: "Đang ở" },
  { key: "CHECKED_OUT", label: "Đã hoàn thành" },
  { key: "CANCELLED", label: "Đã huỷ" },
];

// ── SWR Key ─────────────────────────────────────────────────────────────────
const getKey = (pageIndex: number, previousPageData: any) => {
  if (
    previousPageData &&
    (!previousPageData.data || previousPageData.data.length === 0)
  )
    return null;
  return `${URL_API}/api/booking/bookingUser?page=${pageIndex + 1}&limit=10`;
};

// ── Page ─────────────────────────────────────────────────────────────────────
const Page = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { data, isLoading, size, setSize, isValidating } =
    useSWRInfinite(getKey);

  const allBookings: Booking[] = data
    ? data.flatMap((page) => page.data || [])
    : [];
  const isReachEnd = data && data[data.length - 1]?.data?.length === 0;

  const filtered = useMemo(() => {
    if (activeTab === "ALL") return allBookings;
    return allBookings.filter((b) => b.status === activeTab);
  }, [allBookings, activeTab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: allBookings.length };
    TABS.slice(1).forEach((tab) => {
      map[tab.key] = allBookings.filter((b) => b.status === tab.key).length;
    });
    return map;
  }, [allBookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đặt phòng của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và theo dõi các đơn đặt phòng
          </p>
        </div>

        {/* Status tabs */}
        <div className="flex justify-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gray-200" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-600">
                Không có đơn đặt phòng nào
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === "ALL"
                  ? "Bạn chưa có đơn đặt phòng nào."
                  : `Không có đơn nào ở trạng thái "${TABS.find((t) => t.key === activeTab)?.label}".`}
              </p>
            </div>
          </div>
        )}

        {/* Booking list */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!isReachEnd && !isLoading && activeTab === "ALL" && (
          <div className="text-center pt-2">
            <button
              onClick={() => setSize(size + 1)}
              disabled={isValidating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xem thêm đơn đặt phòng"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
