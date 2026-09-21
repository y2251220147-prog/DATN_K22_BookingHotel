"use client";
import React, { useState } from "react";
import CardItemTotal from "./CardItemTotal";
import useSWR from "swr";
import { formatPrice } from "@/lib/formatPrice";
import SelectRangeStatistical from "./SelectRangeStatistical";

const CardStatistical = () => {
  const [range, setRange] = useState("day");
  const { data, isLoading } = useSWR(`/api/dashboard?range=${range}`);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 w-full">
        <CardItemTotal
          title="Loading..."
          total={0}
          description="Loading data"
          className="border-t-green-500 text-green-500"
          image="/RevenueIcon.svg"
        />
        <CardItemTotal
          title="Loading..."
          total={0}
          description="Loading data"
          className="border-t-blue-500 text-blue-500"
          image="/image/customerIcon.png"
        />
        <CardItemTotal
          title="Loading..."
          total={0}
          description="Loading data"
          className=" border-t-red-500 text-red-500"
          image="/image/roomIcon.png"
        />
        <CardItemTotal
          title="Loading..."
          total={0}
          description="Loading data"
          className="border-t-orange-500 text-orange-500"
          image="/image/revenueIcon.png"
        />
      </div>
    );
  }

  const translateRange = (range: string) => {
    switch (range) {
      case "day":
        return "hôm nay";
      case "week":
        return "tuần";
      case "month":
        return "tháng";
      case "year":
        return "năm";
      default:
        return range;
    }
  };
  const translatedRange = translateRange(range);

  return (
    <>
      <SelectRangeStatistical setRange={setRange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-4 gap-2">
        <CardItemTotal
          title={`Tổng đặt phòng (${translatedRange})`}
          total={data?.bookings || 0}
          description="tổng đơn đặt phòng"
          className="border-t-green-500 text-green-500"
          image="/RevenueIcon.svg"
        />
        <CardItemTotal
          title={`Tổng khách hàng (${translatedRange})`}
          total={data?.customers || 0}
          description="tổng khách hàng"
          className="border-t-blue-500 text-blue-500"
          image="/image/customerIcon.png"
        />
        <CardItemTotal
          title={`Tổng Tiền Đặt Phòng (${translatedRange})`}
          total={formatPrice(Number(data?.totalAmount) || 0)}
          description="tổng tiền đặt phòng"
          className=" border-t-red-500 text-red-500"
          image="/image/roomIcon.png"
        />
        <CardItemTotal
          title={`Tổng doanh thu`}
          total={formatPrice(Number(data?.revenue) || 0)}
          description="tổng doanh thu"
          className="border-t-orange-500 text-orange-500"
          image="/image/revenueIcon.png"
        />
      </div>
    </>
  );
};

export default CardStatistical;
