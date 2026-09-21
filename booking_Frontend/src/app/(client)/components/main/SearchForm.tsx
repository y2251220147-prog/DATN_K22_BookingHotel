"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";
import toast from "react-hot-toast";
import { useRoomTypeStore } from "@/hook/roomTypeStore";
import { Calendar, Users, Home, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface IRoomType {
  id: string;
  name: string;
}

interface ISeearchForm {
  setSearchParams: (value: any) => void;
  searchParams: any;
  setLoading: (value: boolean) => void;
  setAvailableRooms: (value: any) => void;
}

type CacheValue = {
  data: any[];
  timestamp: number;
};

const roomCache = new Map<string, CacheValue>();
const TTL = 60_000;

const SearchForm = ({
  searchParams,
  setSearchParams,
  setAvailableRooms,
  setLoading,
}: ISeearchForm) => {
  const { roomType } = useRoomTypeStore();
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setIsSticky(window.scrollY > 1500);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev: any) => ({
      ...prev,
      [name]: name === "customer" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.checkInDate || !searchParams.checkOutDate) {
      toast.error("Vui lòng chọn đầy đủ ngày nhận và trả phòng!");
      return;
    }
    setLoading(true);
    const url = `${URL_API}/api/room/customer?customer=${searchParams.customer}&checkIn=${searchParams.checkInDate}&checkOut=${searchParams.checkOutDate}&roomType=${searchParams.roomType}`;

    try {
      const cached = roomCache.get(url);
      if (cached && Date.now() - cached.timestamp < TTL) {
        setAvailableRooms(cached.data.length > 0 ? cached.data : []);
        if (cached.data.length === 0)
          toast.error("Hiện tại không còn phòng trống");
        return;
      }

      const res = await axios.get(url);
      const rooms = res.data || [];
      roomCache.set(url, { data: rooms, timestamp: Date.now() });
      setAvailableRooms(rooms);
      if (rooms.length === 0) toast.error("Hiện tại không còn phòng trống");
    } catch {
      toast.error("Có lỗi xảy ra khi tìm phòng");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="h-24"></div>;

  return (
    <div
      className={`w-full mx-auto transition-all duration-500 ease-in-out 
        ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-40 py-2 bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-50"
            : "relative py-16"
        }`}
    >
      <motion.div
        layout
        className={`max-w-6xl mx-auto bg-white transition-all duration-300
          ${
            isSticky
              ? "max-w-4xl lg:rounded-full shadow-md border border-gray-100"
              : "rounded-2xl shadow-2xl border border-gray-100 relative pb-8"
          }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col lg:flex-row items-stretch ${isSticky ? "px-2" : ""}`}
        >
          {/* Segment: Check-in */}
          <div
            className={`flex-1 group relative flex flex-col hover:bg-blue-50/40 transition-all border-gray-100 cursor-pointer 
            ${isSticky ? "p-2 px-3 border-none flex-row items-center gap-2" : "p-6 border-b lg:border-b-0 lg:border-r"}`}
          >
            <div className="flex items-center gap-2">
              <Calendar
                size={isSticky ? 16 : 20}
                className="text-blue-500 shrink-0"
              />
              {!isSticky && (
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Ngày nhận
                </label>
              )}
            </div>
            <input
              type="date"
              name="checkInDate"
              value={searchParams.checkInDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className={`bg-transparent border-none outline-none text-gray-800 font-semibold cursor-pointer w-full ${isSticky ? "text-xs" : "text-lg mt-1"}`}
            />
          </div>

          {/* Segment: Check-out */}
          <div
            className={`flex-1 group relative flex flex-col hover:bg-blue-50/40 transition-all border-gray-100 cursor-pointer 
            ${isSticky ? "p-2 px-3 border-none flex-row items-center gap-2" : "p-6 border-b lg:border-b-0 lg:border-r"}`}
          >
            <div className="flex items-center gap-2">
              <Calendar
                size={isSticky ? 16 : 20}
                className="text-red-400 shrink-0"
              />
              {!isSticky && (
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Ngày trả
                </label>
              )}
            </div>
            <input
              type="date"
              name="checkOutDate"
              value={searchParams.checkOutDate}
              onChange={handleChange}
              disabled={!searchParams.checkInDate}
              min={searchParams.checkInDate}
              required
              className={`bg-transparent border-none outline-none text-gray-800 font-semibold cursor-pointer w-full disabled:opacity-30 ${isSticky ? "text-xs" : "text-lg mt-1"}`}
            />
          </div>

          {/* Segment: Guests */}
          <div
            className={`flex-1 group relative flex flex-col hover:bg-blue-50/40 transition-all border-gray-100 cursor-pointer 
            ${isSticky ? "p-2 px-3 border-none flex-row items-center gap-2" : "p-6 border-b lg:border-b-0 lg:border-r"}`}
          >
            <div className="flex items-center gap-2">
              <Users
                size={isSticky ? 16 : 20}
                className="text-purple-500 shrink-0"
              />
              {!isSticky && (
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Số lượng khách
                </label>
              )}
            </div>
            <div className="relative w-full">
              <select
                name="customer"
                value={searchParams.customer}
                onChange={handleChange}
                className={`bg-white p-1 lg:p-2 border-none outline-none text-gray-800 font-semibold cursor-pointer w-full appearance-none ${isSticky ? "text-xs " : "text-lg mt-1"}`}
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Khách hàng
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* Segment: Room Type */}
          <div
            className={`flex-1 group relative flex flex-col hover:bg-blue-50/40 transition-all border-gray-100 cursor-pointer 
            ${isSticky ? "p-2 px-3 border-none flex-row items-center gap-2" : "p-6 border-b lg:border-b-0 lg:border-r"}`}
          >
            <div className="flex items-center gap-2">
              <Home
                size={isSticky ? 16 : 20}
                className="text-emerald-500 shrink-0"
              />
              {!isSticky && (
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Loại phòng
                </label>
              )}
            </div>
            <div className="relative w-full">
              <select
                name="roomType"
                value={searchParams.roomType}
                onChange={handleChange}
                className={`bg-white p-1 lg:p-2 border-none outline-none text-gray-800 font-semibold cursor-pointer w-full appearance-none ${isSticky ? "text-xs" : "text-lg mt-1"}`}
              >
                <option value="">Tất cả hạng phòng</option>
                {roomType?.map((item: IRoomType) => (
                  <option value={item.name} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
          </div>

          {/* Action: Button */}
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all duration-300 font-bold group active:scale-95 shadow-lg
              ${
                isSticky
                  ? "px-6 py-2 rounded-full text-xs my-1 mr-1"
                  : "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[65%] px-16 py-5 rounded-xl text-sm md:text-xl"
              }`}
          >
            <Search
              size={isSticky ? 14 : 24}
              className="group-hover:scale-110 transition-transform"
            />
            <span>TÌM KIẾM</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SearchForm;
