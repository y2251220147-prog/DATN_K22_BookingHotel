import React from "react";
import axiosInstance from "@/lib/axios";
import RecommendedRooms from "@/components/RecommendedRooms";

export default async function RecommendedRoomsServer() {
  try {
    // Gọi API lấy phòng gợi ý cho trang chủ (Trending)
    const res = await axiosInstance.post("/api/room/recommended", {
      roomIds: [] // Mảng rỗng báo hiệu ở trang chủ, cần lấy top trending
    });

    const rooms = res.data;

    if (!rooms || rooms.length === 0) {
      return null;
    }

    return (
      <div className="mt-12 mb-12">
        <RecommendedRooms rooms={rooms} />
      </div>
    );
  } catch (error) {
    console.error("Lỗi khi lấy phòng đề xuất trang chủ:", error);
    return null;
  }
}
