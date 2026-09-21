// app/components/main/Hotel-Highlights.tsx
"use client";
import React from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Highlight {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

interface Props {
  highlights: Highlight[]; // ← nhận data từ server
}

const HotelHighlightsCarousel = ({ highlights }: Props) => {
  // ← KHÔNG CÒN useEffect, useState, axios
  return (
    <section className="py-15 bg-linear-to-br from-background to-muted bg-white mx-4 lg:mx-0">
      <div>
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 border-t border-dashed border-blue-200" />
            <h1 className="text-3xl font-bold text-blue-800 tracking-tight whitespace-nowrap">
              Tiện Nghi Đẳng Cấp
            </h1>
            <span className="flex-1 border-t border-dashed border-blue-200" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
            Khám phá những tiện ích và dịch vụ cao cấp tại khách sạn của chúng
            tôi
          </p>
        </div>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          {highlights.map((highlight) => (
            <SwiperSlide key={highlight.id} className="relative max-w-6xl">
              <div className="w-screen md:w-full shrink-0">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative overflow-hidden group h-80 lg:h-120">
                    <Image
                      width={1000}
                      height={1000}
                      src={highlight.image || "/placeholder.svg"}
                      alt={highlight.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center bg-card pb-8 px-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="text-2xl"
                        dangerouslySetInnerHTML={{ __html: highlight.icon }}
                      />
                      <h3 className="text-2xl md:text-3xl font-bold text-card-foreground">
                        {highlight.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {highlight.description}
                    </p>
                    <div className="space-y-3 mb-8">
                      {highlight.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-black" />
                          <span className="text-card-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button className="self-start bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full">
                      Tìm Hiểu Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HotelHighlightsCarousel;
