"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src="/image/notfound.png"
        alt="notfound"
        className="bg-center bg-contain  h-100"
      />
      <p className="mt-4 text-lg text-gray-600">
        Oops! This page could not be found...
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 underline underline-offset-3 text-red-600 hover:text-red-700"
      >
        Go back home
      </Link>
    </div>
  );
}
