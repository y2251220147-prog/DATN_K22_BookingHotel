// HotelMapWrapper.tsx
"use client";
import dynamic from "next/dynamic";

const HotelMap = dynamic(() => import("./HotelMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 animate-pulse rounded-xl mx-4" />
  ),
});

export default function HotelMapWrapper() {
  return <HotelMap />;
}
