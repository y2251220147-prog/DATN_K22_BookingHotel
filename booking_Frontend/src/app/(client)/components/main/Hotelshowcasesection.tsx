"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    label: "Hồ bơi & Spa",
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  },
  {
    label: "Phòng Deluxe View Biển",
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
  },
  {
    label: "Nhà hàng & Bar",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    label: "Suite Cao Cấp",
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  },
  {
    label: "Sảnh & Tiền sảnh",
    src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
  },
  {
    label: "Phòng họp & Sự kiện",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=80",
  },
  {
    label: "Tầng hầm & Giữ xe",
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
  },
];

export default function HotelShowcaseSection() {
  return (
    <section className="w-full max-w-7xl mx-auto py-20 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="flex-1 border-t border-dashed border-blue-200" />
          <h1 className="text-3xl font-bold text-blue-800 tracking-tight whitespace-nowrap">
            Trải nghiệm tại khách sạn
          </h1>
          <span className="flex-1 border-t border-dashed border-blue-200" />
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
          Không gian nghỉ dưỡng đẳng cấp với đầy đủ tiện nghi — từ hồ bơi vô
          cực, spa thư giãn, đến nhà hàng fine dining và phòng suite view biển
          tuyệt đẹp.
        </p>
      </div>

      {/* Swiper */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={20}
          loop={true}
          allowTouchMove={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={3000}
          style={{ paddingLeft: 40, paddingRight: 40 }}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i} style={{ width: 350 }}>
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer h-[300px]">
                <Image
                  src={slide.src}
                  alt={slide.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="350px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  {slide.label}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
