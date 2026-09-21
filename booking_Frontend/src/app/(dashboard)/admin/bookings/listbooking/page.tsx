"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import useSWR from "swr";
import TableListBooking from "./components/TableListBooking";
import FilterBooking from "./components/FilterBooking";
import { IBooking } from "./components/bookingad";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import LimitSelector from "@/app/(dashboard)/components/Pagination/SelectRecord";

type Dates = {
  checkInDate: Date | null;
  checkOutDate: Date | null;
};

const BookingManagementForm = () => {
  const [isNumber, setIsNumber] = useState<number | string>("");
  const [status, setStatus] = useState<string>("");
  const [order, setOrder] = useState<"default" | "asc" | "desc">("default");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [dates, setDates] = useState<Dates>({
    checkInDate: null,
    checkOutDate: null,
  });

  const params = new URLSearchParams({
    ...(isNumber && { idNumber: String(isNumber) }),
    ...(status && { status }),
    ...(dates.checkInDate && { checkInDate: dates.checkInDate.toISOString() }),
    ...(dates.checkOutDate && {
      checkOutDate: dates.checkOutDate.toISOString(),
    }),
    ...(order !== "default" && { totalAmount: order }),
    page: String(page),
    limit: String(limit),
  });

  const { data } = useSWR<IBooking>(`/api/booking?${params.toString()}`);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="px-4 lg:px-10 py-4 rounded-2xl bg-white">
      <div className="justify-center flex items-center">
        <FilterBooking
          dates={dates}
          setDates={setDates}
          isNumber={isNumber}
          setIsNumber={setIsNumber}
        />
      </div>

      <TableListBooking
        booking={data?.bookings ?? []}
        selectedStatus={status}
        setSelectedStatus={setStatus}
        setOrder={setOrder}
        order={order}
      />

      <div className="flex justify-between items-center mt-4 mr-4">
        <LimitSelector value={limit} onChange={handleLimitChange} />
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.totalPages ?? 1}
        />
      </div>
    </div>
  );
};

export default BookingManagementForm;
