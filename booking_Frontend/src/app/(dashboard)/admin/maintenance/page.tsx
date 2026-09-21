"use client";
import React from "react";
import TableMaintenance from "../rooms/maintenance/components/TableMaitenance";
import useSWR from "swr";

const Page = () => {
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL_API}/api/maintenance`);

  return (
    <div>
      <TableMaintenance maintenance={data || []} />
    </div>
  );
};

export default Page;
