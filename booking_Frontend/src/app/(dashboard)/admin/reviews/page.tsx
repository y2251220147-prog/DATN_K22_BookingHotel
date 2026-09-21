"use client";
import React from "react";
import CheckReviewUser from "./components/CheckReviewUser";
import useSWR from "swr";

const Page = () => {
  const { data } = useSWR(`/api/review/all`);

  return (
    <>
      <CheckReviewUser reviews={data || []} />
    </>
  );
};

export default Page;
