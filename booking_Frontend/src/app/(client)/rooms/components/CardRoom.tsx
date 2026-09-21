import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { ShowCurrentPrice } from "@/lib/showCurrentPrice";
import { Button } from "@/components/ui/button";
import { Wifi, Users, Check, MapPin } from "lucide-react";

interface CardRoomProps {
  room: any;
}

export default async function CardRoom({ room }: CardRoomProps) {
  // ⭐ SSR: fetch giá luôn trên server
  const prices: Record<string, number> = {};

  for (const d of room.rooms) {
    const res = await ShowCurrentPrice({ roomId: d.id });
    prices[d.id] = res.displayPrice;
  }

  if (!room || room.rooms.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {room.name}
        </h1>
        <p className="text-gray-600">Hiện chưa có phòng nào để hiển thị</p>
      </div>
    );
  }

  return (
    <section className="py-15 lg:py-30 px-4 md:px-6 lg:px-10 bg-gray-50">
      {/* Title */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {room.name}
        </h2>
        <p className="text-gray-600 text-xl">
          {room.rooms.length} phòng có sẵn • Sức chứa tối đa {room.maxOccupancy}{" "}
          khách
        </p>
      </div>

      {/* Room Cards */}
      <div className="max-w-7xl mx-auto space-y-6">
        {room.rooms.map((roomDetail: any) => (
          <div
            key={roomDetail.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Image */}
              <div className="lg:col-span-4 relative h-64 lg:h-full">
                <Image
                  src={roomDetail.images[0]?.imageUrl || "/fallback.jpg"}
                  alt={`Phòng ${roomDetail.roomNumber}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="lg:col-span-5 p-6">
                <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Phòng số {roomDetail.roomNumber}</span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {room.maxOccupancy} khách
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4" />
                    WiFi miễn phí
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="lg:col-span-3 bg-blue-50/50 p-6 border-l border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500">Giá mỗi đêm từ</div>

                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(prices[roomDetail.id] * 1.1)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      -10%
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-gray-900 mt-1">
                    {formatPrice(prices[roomDetail.id])}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700 mt-2">
                    <Check className="w-4 h-4" /> Hủy miễn phí
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Check className="w-4 h-4" /> Không cần thanh toán trước
                  </div>
                </div>

                <Link href={`/rooms/${room.id}/${roomDetail.id}`}>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Chọn phòng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
