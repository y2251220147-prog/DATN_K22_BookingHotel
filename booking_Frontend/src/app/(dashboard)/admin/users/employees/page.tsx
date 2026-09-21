"use client";
import React, { useEffect, useRef, useState } from "react";
import EmployeeTable from "./components/TableEmployee";
import useSWR from "swr";
import { fetcher, URL_API } from "@/lib/fetcher";
import { useDebounce } from "../../../../../hook/useDebounce";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import LimitSelector from "@/app/(dashboard)/components/Pagination/SelectRecord";

const Page = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 1000);
  const isFirstLoad = useRef(true);

  const { data, isLoading } = useSWR(
    `${URL_API}/api/auth/employee?${
      search && `search=${encodeURIComponent(debouncedSearch)}`
    }&page=${currentPage}&limit=${limit}`,
  );
  useEffect(() => {
    if (data) isFirstLoad.current = false;
  }, [data]);
  // Kiểm tra trạng thái loading và hiển thị thông báo

  return (
    <div className="bg-white p-6 rounded-xl">
      {isLoading && isFirstLoad.current ? (
        <div className="text-center col-span-5">Đang tải dữ liệu...</div>
      ) : (
        <EmployeeTable
          employee={data?.employee.result || []}
          search={search}
          setSearchTerm={setSearch}
          setCurrentPage={setCurrentPage}
        />
      )}
      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPages={data?.employee?.totalPages || 1}
      />
      <LimitSelector onChange={setLimit} value={limit} />
    </div>
  );
};

export default Page;
