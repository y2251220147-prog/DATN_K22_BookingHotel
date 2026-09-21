"use client";
import Image from "next/image";
import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: string;
}

interface GalleryClientProps {
  images: GalleryImage[];
}

export const GalleryClient = ({ images }: GalleryClientProps) => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () =>
    setLightbox((i) => (i! - 1 + images.length) % images.length);
  const next = () => setLightbox((i) => (i! + 1) % images.length);

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 px-4 md:px-10 lg:px-16 py-10">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="mb-4 break-inside-avoid group relative cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightbox(idx)}
          >
            <div className="relative w-full h-64 md:h-80">
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={idx < 3}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                <span className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">
                  {img.category}
                </span>
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {img.title}
                </h3>
                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                  {img.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-white/60 text-xs">
                  <ZoomIn size={14} />
                  <span>Xem chi tiết</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft size={36} />
          </button>

          {/* Image + Info */}
          <div
            className="flex flex-col lg:flex-row max-w-5xl w-full mx-4 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full lg:w-2/3 h-[50vh] lg:h-[70vh]">
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="bg-white lg:w-1/3 p-6 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                {images[lightbox].category}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {images[lightbox].title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {images[lightbox].description}
              </p>
              <p className="mt-6 text-sm text-gray-400">
                {lightbox + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 text-white/70 hover:text-white z-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  );
};

export default GalleryClient;
