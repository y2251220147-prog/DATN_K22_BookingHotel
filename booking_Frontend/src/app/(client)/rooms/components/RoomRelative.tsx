"use client";
import React, { useMemo } from "react";

import { URL_API } from "@/lib/fetcher";

import ListRoom, { RoomCustomer } from "../../components/main/ListRoom";
import useSWR from "swr";

const RoomRelative = ({
  RoomTypeId,
  currentRoomId,
}: {
  RoomTypeId: string;
  currentRoomId: string;
}) => {
  const { data } = useSWR<RoomCustomer[]>(`/api/room/customer`);

  // Filter rooms with same roomTypeId but different id
  const relatedRooms = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (room) => room.roomTypeId === RoomTypeId && room.id !== currentRoomId,
    );
  }, [data, RoomTypeId, currentRoomId]);
  if (!data) return <div>Đang tải dữ liệu...</div>;
  return (
    <>
      <div className="my-10 bg-white p-3">
        {
          relatedRooms.length === 0
            ? null
            : <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
              Những Phòng Liên Quan
            </h1>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 2xl:gap-3">
          {relatedRooms && relatedRooms.length > 0
            ? relatedRooms.slice(0, 4).map((room, index) => (
              <div
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
                key={`related-${room.id}`}
              >
                <ListRoom roomtype={room} />
              </div>
            ))
            : null}
        </div>
      </div>
    </>
  );
};

export default RoomRelative;
