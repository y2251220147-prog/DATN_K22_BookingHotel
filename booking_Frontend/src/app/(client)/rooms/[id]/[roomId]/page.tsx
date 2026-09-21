"use client";
import React, { use, useEffect, useState } from "react";
import useSWR from "swr";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import FormBooking from "../../components/FormBooking";
import DetailRooms from "../../components/DetailRooms";
import RoomRelative from "../../components/RoomRelative";
import { ShowCurrentPrice } from "@/lib/showCurrentPrice";
import { useBookingStore } from "@/hook/useBookingForm";

export interface RoomData {
  room: {
    id: string;
    roomNumber: string;
    floor: number;
    status: RoomStatus;
    originalPrice: number;
    currentPrice: number;
    notes: string;
    images: Array<{ imageUrl: string }>;
    roomType: {
      name: string;
      description: string;
      maxOccupancy: number;
      amenities: Array<{ amenity: { name: string } }>;
    };
  };
}

enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const { roomId, id } = use(params);
  const { formData, setFormData } = useBookingStore();
  const { data, isLoading } = useSWR<RoomData>(
    `${process.env.NEXT_PUBLIC_URL_API}/api/room/${roomId}`,
  );

  const [seasonPrice, setSeasonPrice] = useState({
    total: 0,
    currentPrice: 0,
    originalPrice: 0,
    displayPrice: 0,
  });

  useEffect(() => {
    async function fetchPrice() {
      const price = await ShowCurrentPrice({
        bookingStart: formData.checkInDate,
        bookingEnd: formData.checkOutDate,
        roomId: roomId,
      });
      setSeasonPrice(price);
      setFormData({
        pricePerNight: Number(price.displayPrice || 0),
        totalAmount: Number(price.total || 0),
        roomId: roomId,
      });
    }
    if (roomId) {
      fetchPrice();
    }
  }, [formData.checkInDate, formData.checkOutDate, formData.roomId, data]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-serif italic text-gray-600">
            Đang tải thông tin phòng...
          </p>
        </div>
      </div>
    );

  if (!data) return null;

  const { room } = data;

  return (
    <div className=" ">
      <div className="bg-white  shadow-2xl  border border-gray-100">
        {/* Main Content */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4 x:mx-10 my-4">
          {" "}
          <div className="lg:col-span-2">
            {" "}
            <DetailRooms room={room} seasonPrice={seasonPrice} />
          </div>
          {/* Booking Form */}
          <div className="col-span-1">
            <FormBooking
              room={room}
              handleFormChange={handleFormChange}
              seasonPrice={seasonPrice}
            />
          </div>
        </div>
      </div>
      <RoomRelative RoomTypeId={id} currentRoomId={roomId} />
    </div>
  );
}
