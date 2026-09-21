"use client";
import { fetcher } from "@/lib/fetcher";
import { SWRConfig } from "swr";

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
        shouldRetryOnError: false, // tắt retry tự động
        dedupingInterval: 60000, // cache 60s, tránh gọi lại cùng key
        revalidateOnFocus: false, // tắt - gọi lại mỗi khi focus tab
        revalidateOnReconnect: false, // tắt - gọi lại mỗi khi có mạng
        revalidateIfStale: false, // tắt - gọi lại khi data cũ
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
