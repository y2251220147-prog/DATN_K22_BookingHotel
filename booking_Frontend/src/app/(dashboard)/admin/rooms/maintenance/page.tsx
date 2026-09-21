"use client";
import React from "react";
import TableMaintenance from "./components/TableMaitenance";
import useSWR from "swr";

const Page = () => {
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL_API}/api/maintenance`);

  // Nếu còn loading

  return (
    <div className="bg-white p-6 rounded-xl ">
      <TableMaintenance maintenance={data || []} />
    </div>
  );
};

export default Page;
