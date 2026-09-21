"use client";
import React from "react";
import TableAmenies from "./components/TableAmenies";
import useSWR from "swr";
import AddAmenies from "./components/AddAmenies";
import { useState } from "react";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import LimitSelector from "@/app/(dashboard)/components/Pagination/SelectRecord";

const Page = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useSWR(
    `/api/amenity?page=${page}&limit=${limit}`,
  );

  console.log("data?.amenity", data);

  // Nếu còn loading

  if (error) {
    return <div>Đã xảy ra lỗi: {error.message}</div>;
  }

  // Kiểm tra trạng thái loading và hiển thị thông báo
  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-end items-center ">
        <AddAmenies />
      </div>
      {isLoading ? (
        <div className="text-center col-span-5">Đang tải dữ liệu...</div>
      ) : (
        <TableAmenies amenities={data?.data?.amenity || []} />
      )}
      <div className="flex justify-between  items-center gap-2">

        <LimitSelector onChange={setLimit} value={limit} />
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.data?.totalPages || 0}
        />
      </div>
    </div>
  );
};

export default Page;
