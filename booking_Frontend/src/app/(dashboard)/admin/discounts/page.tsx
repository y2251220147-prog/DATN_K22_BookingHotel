"use client";
import React, { useState } from "react";
import useSWR from "swr";
import TableDiscount from "./components/TableDisCount";
import CreateDiscount from "./components/CreateDisCount";

export interface IDiscount {
  id: string;
  code: string;
  percentage: number;
  validFrom: string;
  validTo: string;
}
const Page = () => {
  const { data, isLoading } = useSWR(`/api/discount/getAll`);
  const [statusFilter, setStatusFilter] = useState<"" | "EXPIRED" | "ACTIVE">(
    "",
  );

  return (
    <div className=" py-3  rounded-2xl bg-white">
      <div className="flex mx-4 justify-between mb-4 ">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             hover:border-gray-400 transition-all"
        >
          <option value="">Tất cả</option>
          <option value="ACTIVE">Còn hạn</option>
          <option value="EXPIRED">Hết hạn</option>
        </select>
        <CreateDiscount />
      </div>
      <TableDiscount
        discounts={data?.allDisCode}
        isLoading={isLoading}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
      />
    </div>
  );
};

export default Page;
