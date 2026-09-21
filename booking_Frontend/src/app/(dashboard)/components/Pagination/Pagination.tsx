"use client";

import React from "react";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mr-4 items-center mt-4 gap-1.5">
      {/* Nút Previous */}
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200
          disabled:opacity-35 disabled:cursor-not-allowed
          hover:bg-gray-100 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 11L5 7L9 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Số trang */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-colors
            ${
              p === page
                ? "bg-blue-500 text-white border-blue-500 font-medium"
                : "border-gray-200 text-gray-500 hover:bg-gray-100"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Nút Next */}
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200
          disabled:opacity-35 disabled:cursor-not-allowed
          hover:bg-gray-100 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M5 3L9 7L5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
