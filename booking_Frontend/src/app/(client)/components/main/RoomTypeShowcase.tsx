// components/RoomTypeShowcase.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useChatDragStore } from "@/hook/useChatDragStore";
import axiosInstance from "@/lib/axios";

const ROOM_TYPE_CACHE_KEY = "home-room-types-v1";
const ROOM_TYPE_CACHE_TTL = 6 * 60 * 60 * 1000;

interface Amenity {
  id: string;
  name: string;
}

export interface IRoomType {
  id: string;
  name: string;
  description: string | null;
  maxOccupancy: number;
  photoUrls: string;
  amenities: {
    amenity: Amenity;
  }[];
}

async function getRoomTypes() {
  try {
    const res = await axiosInstance.get("/api/roomtype", { timeout: 12000 });
    // API trả về object { roomType: [], pagination: {} }
    return res.data?.roomType || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại phòng:", error);
    return [];
  }
}

export default function RoomTypeShowcase() {
  const [roomType, setRoomType] = useState<IRoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let hasCachedData = false;

    try {
      const cachedValue = localStorage.getItem(ROOM_TYPE_CACHE_KEY);
      if (cachedValue) {
        const cached = JSON.parse(cachedValue) as {
          savedAt: number;
          data: IRoomType[];
        };

        if (
          Array.isArray(cached.data) &&
          cached.data.length > 0 &&
          Date.now() - cached.savedAt < ROOM_TYPE_CACHE_TTL
        ) {
          hasCachedData = true;
          setRoomType(cached.data);
          setLoading(false);
        }
      }
    } catch {
      // Storage can be unavailable in private browsing; continue with the API.
    }

    getRoomTypes().then((data) => {
      if (data.length > 0) {
        setRoomType(data);
        try {
          localStorage.setItem(
            ROOM_TYPE_CACHE_KEY,
            JSON.stringify({ savedAt: Date.now(), data }),
          );
        } catch {
          // Rendering fresh data is more important than persisting the cache.
        }
      } else if (!hasCachedData) {
        setRoomType([]);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải danh sách phòng...</p>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Khám Phá Các Loại Phòng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm không gian nghỉ dưỡng được thiết kế tinh tế, mang đến sự
            thoải mái tuyệt đối cho kỳ nghỉ của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomType?.map((rt, index) => (
            <RoomCard key={rt.id} roomType={rt} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ roomType, index }: { roomType: IRoomType; index: number }) {
  const { setDraggedRoom } = useChatDragStore();

  return (
    <motion.div
      draggable
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onDragStart={() => setDraggedRoom(roomType)}
      onDragEnd={() => setDraggedRoom(null)}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <Link href={`/rooms/${roomType.id}`}>
        <div className="relative h-72 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={roomType.photoUrls || ""}
              alt={roomType.name}
              fill
              className="object-cover transition-all duration-700 opacity-100 scale-100"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Tối đa {roomType.maxOccupancy} người
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {roomType.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {roomType.description || "Phòng được thiết kế sang trọng với đầy đủ tiện nghi hiện đại"}
          </p>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Tiện Nghi</h4>
            <div className="flex flex-wrap gap-2">
              {roomType.amenities?.slice(0, 4).map(({ amenity }) => (
                <span
                  key={amenity.id}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full cursor-default hover:bg-blue-100 transition-colors"
                >
                  {amenity.name}
                </span>
              ))}
              {roomType.amenities && roomType.amenities.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{roomType.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
