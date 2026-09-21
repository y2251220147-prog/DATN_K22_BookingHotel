"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Bath,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export interface RoomCustomer {
  id: string;
  roomTypeId: string;
  currentPrice: number;
  originalPrice: number;
  images: {
    id: string;
    imageUrl: string;
  }[];
  roomType: {
    name: string;
    maxOccupancy: number;
    amenities: {
      amenity: {
        name: string;
      };
    }[];
  };
}

interface RoomType {
  roomtype: RoomCustomer;
}

const ListRoom = ({ roomtype }: RoomType) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAmenityIcon = (amenityName: string) => {
    const name = amenityName.toLowerCase();
    if (name.includes("wifi") || name.includes("internet"))
      return <Wifi className="w-3 h-3" />;
    if (name.includes("parking") || name.includes("đỗ xe"))
      return <Car className="w-3 h-3" />;
    if (name.includes("coffee") || name.includes("cà phê"))
      return <Coffee className="w-3 h-3" />;
    if (name.includes("tv") || name.includes("tivi"))
      return <Tv className="w-3 h-3" />;
    if (name.includes("bath") || name.includes("tắm"))
      return <Bath className="w-3 h-3" />;
    if (name.includes("safe") || name.includes("két"))
      return <Lock className="w-3 h-3" />;
    return <Coffee className="w-3 h-3" />;
  };

  const hasDiscount = roomtype.currentPrice < roomtype.originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((roomtype.originalPrice - roomtype.currentPrice) /
          roomtype.originalPrice) *
          100,
      )
    : 0;

  const handleCardClick = () =>
    router.push(`/rooms/${roomtype.roomTypeId}/${roomtype.id}`);

  return (
    <div className="w-full max-w-sm mx-auto">
      <article
        className="group bg-white rounded-[20px] border border-gray-100 overflow-hidden cursor-pointer
                   transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      >
        {/* ── Image ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <Image
            alt={roomtype.roomType.name}
            src={roomtype.images[0]?.imageUrl || "/placeholder.svg"}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className={`object-cover transition-all duration-500
              ${imageLoaded ? "scale-100" : "scale-105"}
              group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            quality={85}
          />

          {/* Discount badge */}
          {hasDiscount && (
            <span
              className="absolute top-3 right-3 z-10
                             bg-red-500 text-red-50 text-xs font-semibold
                             px-2.5 py-1 rounded-lg tracking-wide"
            >
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-5 space-y-4">
          {/* Name + chevron */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-semibold text-gray-900 text-[17px] leading-snug line-clamp-2 flex-1"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {roomtype.roomType.name}
            </h3>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1 group-hover:text-blue-600 transition-colors" />
          </div>

          {/* Occupancy */}
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            Tối đa {roomtype.roomType.maxOccupancy} khách
          </div>

          {/* Amenity pills */}
          <div className="flex flex-wrap gap-1.5">
            {roomtype.roomType.amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[12px] text-gray-600
                           bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1"
              >
                <span className="text-gray-400">
                  {getAmenityIcon(amenity.amenity.name)}
                </span>
                {amenity.amenity.name}
              </span>
            ))}
            {roomtype.roomType.amenities.length > 4 && (
              <span
                className="inline-flex items-center text-[12px] text-gray-400
                               bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1"
              >
                +{roomtype.roomType.amenities.length - 4} tiện nghi
              </span>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Price + CTA */}
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              {hasDiscount && (
                <p className="text-[12px] text-gray-400 line-through">
                  {formatPrice(roomtype.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-semibold text-blue-700">
                  {formatPrice(roomtype.currentPrice)}
                </span>
                <span className="text-sm text-gray-400">/đêm</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white
                         rounded-[10px] px-5 py-2 text-sm font-medium
                         shadow-none transition-colors"
            >
              Xem phòng
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ListRoom;
