"use client";
import React, { useState } from "react";
import RoomTypesAdminPage from "./components/TableRoomtype";
import useSWR from "swr";
import CreateRoomtype from "./components/CreateRoomtype";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";

import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import { useDebounce } from "@/hook/useDebounce";

const Page = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 800);

  const { data, isLoading } = useSWR(
    `/api/roomtype?search=${debouncedSearch}&page=${page}&limit=${limit}`,
  );

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex justify-between items-center">
        {" "}
        <SearchForm
          placeholder="Tìm Kiếm Loại Phòng"
          search={search}
          setPage={setPage}
          setSearch={setSearch}
        />
        <CreateRoomtype />
      </div>
      {isLoading ? (
        <div className="text-center col-span-5">Đang tải dữ liệu...</div>
      ) : (
        <RoomTypesAdminPage roomTypes={data?.roomType || []} />
      )}
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={data?.pagination?.totalPages || 1}
      />
    </div>
  );
};

export default Page;
