"use client";

import type React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { Users, Star, CheckCircle, Clock, Shield } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { formatPrice } from "@/lib/formatPrice";
import MarkDown from "@/hook/MarkDown";

interface DetailRoomsProps {
  room: {
    id: string;
    roomNumber: string;
    floor: number;
    notes: string;
    currentPrice: number;
    originalPrice: number;
    images: Array<{ imageUrl: string }>;
    roomType: {
      name: string;
      description: string;
      maxOccupancy: number;
      amenities: Array<{ amenity: { name: string } }>;
    };
  };
  seasonPrice: {
    total: number;
    currentPrice: number;
    originalPrice: number;
    displayPrice: number;
  };
}
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center gap-3 font-serif text-2xl lg:text-3xl font-medium text-gray-900 mb-6">
    <span className="w-[3px] h-7 rounded-sm bg-blue-600 shrink-0" />
    {children}
  </h2>
);
const DetailRooms: React.FC<DetailRoomsProps> = ({ room, seasonPrice }) => {
  return (
    <>
      {/* Main Content */}
      <div className="space-y-10  md:max-h-screen overflow-auto">
        {/* Enhanced Header Section */}
        <div className="relative">
          <div className="flex flex-row justify-between items-start md:items-center border-b pb-8 border-gray-200">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 mb-2 text-balance">
                {room.roomType.name}
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Phòng {room.roomNumber} • Tầng {room.floor}
              </p>
            </div>
            <div className="text-right flex mt-6">
              <p className="text-2xl lg:text-4xl font-bold text-blue-600 mb-1">
                {formatPrice(Number(seasonPrice.displayPrice))}
              </p>
              <span className="text-lg font-normal text-gray-500">/đêm</span>
            </div>
          </div>

          {/* Enhanced Key Features */}
          <div className="flex flex-wrap gap-12 mt-6">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
              <Users size={20} className="text-blue-600" />
              <span className="text-gray-700 font-medium">
                Tối đa {room.roomType.maxOccupancy} khách
              </span>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
              <Star size={20} className="text-amber-500 " />
              <span className="text-gray-700 font-medium">Phòng cao cấp</span>
            </div>
          </div>
        </div>

        {/* Enhanced Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            effect="fade"
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "swiper-pagination-bullet-custom",
              bulletActiveClass: "swiper-pagination-bullet-active-custom",
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            className="w-full h-[500px] lg:h-[650px]"
          >
            {room.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={`${room.roomType.name} - Phòng ${room.roomNumber}`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 inline-block">
                      <h2 className="text-2xl lg:text-3xl font-serif mb-1 tracking-wide">
                        {room.roomType.name}
                      </h2>
                      <p className="text-lg font-light opacity-90">
                        Không gian sang trọng & tiện nghi
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Description */}
        <div className="bg-linear-to-r bg-stone-100 rounded-2xl">
          <SectionTitle>Giới thiệu</SectionTitle>
          <div className="bg-stone-100 border border-gray-100 rounded-2xl px-6 py-5 text-gray-600 leading-relaxed">
            <MarkDown>{room.notes}</MarkDown>
          </div>
        </div>

        {/* Enhanced Amenities */}
        <div>
          <SectionTitle>Tiện nghi phòng</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {room.roomType.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {item.amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Policies */}
        <div>
          <SectionTitle>Chính sách</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in/out */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full shrink-0">
                  <Clock size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-blue-900 text-base">
                  Nhận phòng &amp; Trả phòng
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Nhận phòng: 14:00",
                  "Trả phòng: 12:00",
                  "Nhận phòng sớm theo yêu cầu",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-blue-900"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-full shrink-0">
                  <Shield size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-green-900 text-base">
                  Hủy phòng
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Miễn phí hủy trước 3 ngày",
                  "Hoàn tiền 50% trong vòng 24h",
                  "Không hoàn tiền trong ngày",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 text-sm text-green-900"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailRooms;
