// app/components/main/BannerClient.tsx
"use client";
import React from "react";
import { Navigation, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeroSection } from "../common/HeroSection";
import Image from "next/image";

interface BannerClientProps {
  images: string[];
}

const BannerClient = ({ images }: BannerClientProps) => {
  if (images?.length === 0) return <div>Loading...</div>;

  return (
    <Swiper
      keyboard={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      modules={[Navigation, Keyboard, Autoplay]}
      className="mySwiper w-screen h-[50%] lg:w-full"
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <SwiperSlide key={index}>
            {/* Đối với slide đầu tiên, sử dụng HeroSection */}
            {index === 0 ? (
              <HeroSection
                backgroundImage={image} // Sử dụng dữ liệu từ Google Sheets
                title="DAU HOTEL"
                description="Xin kính chào quý khách đến với DAU HOTEL - Nơi trải nghiệm đỉnh cao của sự sang trọng và tiện nghi giữa lòng thành phố sôi động. Hãy để chúng tôi chăm sóc bạn với dịch vụ hoàn hảo và không gian nghỉ dưỡng đẳng cấp."
                className="h-[50vh] xl:h-screen"
                variant="default"
              />
            ) : (
              <div className="relative h-[50vh] lg:h-screen w-full">
                <Image
                  src={image}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </SwiperSlide>
        ))
      ) : (
        <div>Loading...</div> // Hiển thị "Loading" khi dữ liệu chưa được tải xong
      )}
    </Swiper>
  );
};

export default BannerClient;
