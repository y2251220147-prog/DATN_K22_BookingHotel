"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { Wifi, Users, ArrowRight } from "lucide-react";

interface RecommendedRoom {
  id: string;
  roomNumber: string;
  currentPrice: number | string;
  images: { imageUrl: string }[];
  roomType: {
    id: string;
    name: string;
    maxOccupancy: number;
    amenities: {
      amenity: {
        name: string;
      };
    }[];
  };
  recommendationReason?: string;
}

interface RecommendedRoomsProps {
  rooms: RecommendedRoom[];
}

export default function RecommendedRooms({ rooms }: RecommendedRoomsProps) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Gợi ý dành cho bạn
          </h2>
          <div className="w-20 h-1 bg-blue-600 mt-2 rounded-full hidden md:block"></div>
          <p className="mt-4 text-lg text-gray-500">
            Khám phá những không gian nghỉ dưỡng tuyệt vời nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <Card 
              key={room.id} 
              className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group bg-white rounded-2xl"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={room.images?.[0]?.imageUrl || "/fallback.jpg"}
                  alt={room.roomNumber}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-blue-600/90 hover:bg-blue-700 text-white border-none px-3 py-1 text-[11px] font-bold backdrop-blur-sm shadow-lg">
                    {room.recommendationReason || "ĐỀ XUẤT"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                      {room.roomType.name}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Phòng {room.roomNumber}
                    </h3>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-black text-gray-900">
                      {formatPrice(Number(room.currentPrice))}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Mỗi đêm</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-2">
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{room.roomType.maxOccupancy} khách</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Wifi className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Free WiFi</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {room.roomType.amenities.slice(0, 4).map((item, idx) => (
                    <span 
                      key={idx} 
                      className="bg-gray-50 text-gray-500 text-[11px] font-medium px-3 py-1 rounded-lg border border-gray-100"
                    >
                      {item.amenity.name}
                    </span>
                  ))}
                  {room.roomType.amenities.length > 4 && (
                    <span className="text-[11px] text-gray-400 font-bold self-center ml-1">
                      +{room.roomType.amenities.length - 4}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Link 
                  href={`/rooms/${room.roomType.id}/${room.id}`}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-blue-200"
                >
                  Khám phá ngay
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
