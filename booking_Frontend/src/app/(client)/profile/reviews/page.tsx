"use client";
import React from "react";
import ReviewOfCustomer from "../components/ReviewOfCustomer";
import useSWR from "swr";

const ReviewsPage = () => {
  const { data: reviews } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_API}/api/review`
  );

  return (
    <div className="px-4 lg:px-0 py-10">
      <ReviewOfCustomer review={reviews || []} />
    </div>
  );
};

export default ReviewsPage;
