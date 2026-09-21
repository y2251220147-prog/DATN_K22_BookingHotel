"use client";
import React, { useState } from "react";
import TableBlog from "./components/TableBlog";
import useSWR from "swr";
import SearchForm from "../../components/searchPage/SearchForm";
import LimitSelector from "../../components/Pagination/SelectRecord";
import Pagination from "../../components/Pagination/Pagination";
import { useDebounce } from "@/hook/useDebounce";

const Page = () => {
  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
    search: "",
  });
  const debouncedSearch = useDebounce(query.search, 1000);

  const { data, isLoading } = useSWR(
    `/api/blog/employee?limit=${query.limit}&page=${query.page}&search=${debouncedSearch}`,
  );

  if (isLoading) return <>...</>;
  return (
    <div className="bg-white p-2 rounded-2xl">
      <SearchForm
        placeholder="tìm kiếm tiêu đề..."
        search={query.search}
        setPage={() => setQuery((e) => ({ ...e, page: 1 }))}
        setSearch={(search) => setQuery((e) => ({ ...e, search }))}
        resetPage={false}
      />
      <TableBlog posts={data?.blogs || []} />
      <div className="flex justify-between items-center mt-4 mr-4">
        <LimitSelector
          value={query.limit}
          onChange={(value) => setQuery((e) => ({ ...e, limit: value }))}
        />
        <Pagination
          page={query.page}
          setPage={(page) =>
            setQuery((prev) => ({
              ...prev,
              page: typeof page === "function" ? page(prev.page) : page,
            }))
          }
          totalPages={data?.totalPages ?? 1}
        />
      </div>
    </div>
  );
};

export default Page;
