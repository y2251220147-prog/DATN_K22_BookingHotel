"use client";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import DeleteReview from "./DeleteReview";

interface User {
  id: string;
  lastName: string;
  firstName: string;
}

interface Customer {
  user: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewDate: string;
  customer: Customer;
}

export interface ReviewTableFormProps {
  reviews: Review[];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.098 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
      </svg>
    ))}
    <span className="ml-1 text-xs text-gray-400 font-medium">{rating}/5</span>
  </div>
);

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
      {initials}
    </div>
  );
};

export default function ReviewTableForm({ reviews }: ReviewTableFormProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-400 text-sm">
        Chưa có đánh giá nào
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl divide-y divide-gray-100">
      {reviews.map((review) => {
        const fullName =
          `${review.customer.user.firstName} ${review.customer.user.lastName}`.trim();

        return (
          <div
            key={review.id}
            className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <Avatar name={fullName} />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {fullName}
                </span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {review.comment}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(review.reviewDate), {
                  addSuffix: true,
                  locale: vi,
                })}{" "}
                · {format(new Date(review.reviewDate), "dd/MM/yyyy")}
              </p>
            </div>

            {/* Delete */}
            <div className="flex-shrink-0 self-start mt-0.5">
              <DeleteReview id={review.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
