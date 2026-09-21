"use client";
import React from "react";
import { SeasonalRatesManager } from "./components/SeasonalRatesManager";
import useSWR from "swr";

const Page = () => {
  const { data, isLoading } = useSWR(`api/seasonal`);
  if (isLoading) {
    return <div>loading.....</div>;
  }
  console.log(data);

  return (
    <div>
      <SeasonalRatesManager initialData={data?.seasonalRates || []} />
    </div>
  );
};

export default Page;
