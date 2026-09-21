"use client";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ShowCurrentPrice } from "@/lib/showCurrentPrice";

interface Iroom {
  room: {
    id: string;
    roomTypeId: string;
    originalPrice: number;
    roomType: {
      maxOccupancy: number;
      name: string;
    };
    images: { imageUrl: string }[];
  };
}

const RoomCard = ({ room }: Iroom) => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPrice() {
      const res = await ShowCurrentPrice({ roomId: room.id });
      setPrice(res.displayPrice);
    }
    fetchPrice();
  }, [room.id]);

  return (
    <div className="group w-full bg-white rounded-2xl border border-gray-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
        <Image
          src={room.images[0]?.imageUrl || "/images/room-placeholder.jpg"}
          alt={room.roomType.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge bottom-left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 rounded-lg px-2.5 py-1">
          <Star className="w-3 h-3 fill-blue-600 text-blue-600" />
          <span className="text-xs font-medium text-blue-800">Premium</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Name */}
        <h3
          className="text-[20px] font-semibold text-gray-900 mb-2 leading-snug"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {room.roomType.name}
        </h3>

        {/* Occupancy */}
        <div className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-5">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          Tối đa
          <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {room.roomType.maxOccupancy} người
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Giá từ</p>
            <div className="flex items-baseline gap-1">
              <span
                className="text-[22px] font-semibold text-blue-700 leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {price !== null ? formatPrice(price) : "—"}
              </span>
              <span className="text-xs text-gray-400">/đêm</span>
            </div>
          </div>

          <Link
            href={`/rooms/${room.roomTypeId}/${room.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800
                       text-white text-[13px] font-medium
                       px-4 py-2.5 rounded-[10px] transition-colors"
          >
            Đặt ngay
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
