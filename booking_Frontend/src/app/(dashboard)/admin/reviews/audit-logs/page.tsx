"use client";
import React, { useState } from "react";
import useSWR from "swr";
import TableAuditLog from "./components/TableAuditLog";
import { Button } from "@/components/ui/button";

const Page = () => {
  const today = new Date();
  const [mode, setMode] = useState("Ngày");

  // State lưu giá trị ngày, tháng, năm để người dùng tuỳ chỉnh lọc
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const getDisplayDate = () => {
    if (mode === "Ngày") {
      return `?day=${day}&month=${month}&year=${year}`;
    }
    if (mode === "Tháng") {
      return `?month=${month}&year=${year}`;
    }
    if (mode === "Năm") {
      return `?year=${year}`;
    }
  };

  const { data, isLoading } = useSWR(
    `/api/auth/auditlog${getDisplayDate()}`,
  );

  // Thêm State để lưu Tab (Entity) đang trỏ tới (Tất cả, Booking, User, v.v...)
  const [activeTab, setActiveTab] = useState("All");

  // Định nghĩa các loại Tab
  const tabs = [
    { label: "Tất cả", entity: "All" },
    { label: "Đặt phòng", entity: "Booking" },
    { label: "Thanh toán", entity: "Payment" },
    { label: "Người dùng", entity: "User" },
  ];

  // Tính toán số lượng của các Tab để nhét vào số (10), (0)
  const counts = tabs.reduce((acc, tab) => {
    if (!data) {
      acc[tab.entity] = 0;
    } else if (tab.entity === "All") {
      acc[tab.entity] = data.length;
    } else {
      acc[tab.entity] = data.filter((log: any) => log.entity === tab.entity).length;
    }
    return acc;
  }, {} as Record<string, number>);


  // Dữ liệu nhét vào Bảng cuối cùng
  const filteredLogs = !data
    ? []
    : activeTab === "All"
      ? data
      : data.filter((log: any) => log.entity === activeTab);

  return (
    <div className="px-4 lg:px-10 py-4 flex flex-col gap-4 rounded-2xl bg-white shadow-sm border border-slate-100">

      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
        {/* Bộ Lọc Nhập Liệu */}
        <div className="flex items-center gap-3">
          {mode === "Ngày" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Ngày:</span>
              <input
                type="number"
                min={1} max={31}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border rounded-md text-sm outline-none focus:border-black"
              />
            </div>
          )}

          {(mode === "Ngày" || mode === "Tháng") && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Tháng:</span>
              <input
                type="number"
                min={1} max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border rounded-md text-sm outline-none focus:border-black"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Năm:</span>
            <input
              type="number"
              min={2000}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-20 px-2 py-1.5 border rounded-md text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Nút chọn chế độ Lọc */}
        <div className="flex gap-2">
          {["Ngày", "Tháng", "Năm"].map((item) => (
            <Button
              key={item}
              variant={mode === item ? "default" : "outline"} // Chọn nút nào thì nút đó đổi màu nổi bật
              className="cursor-pointer"
              onClick={() => setMode(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      {/* DẢI TAB HIỂN THỊ CÁC MỤC (NHƯ ẢNH MẪU YÊU CẦU) */}
      <div className="flex border-b border-gray-200 mt-2 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.entity}
            onClick={() => setActiveTab(tab.entity)}
            className={`px-5 py-3 text-[15px] font-medium border-b-2 transition-colors duration-200 ${activeTab === tab.entity
              ? "border-blue-700 text-blue-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
          >
            {tab.label} {data ? `(${counts[tab.entity]})` : ""}
          </button>
        ))}
      </div>

      {/* Hiển thị Loading hoặc Data */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Đang tải biểu mẫu...</div>
      ) : (
        <TableAuditLog auditLogs={filteredLogs} />
      )}
    </div>
  );
};

export default Page;
