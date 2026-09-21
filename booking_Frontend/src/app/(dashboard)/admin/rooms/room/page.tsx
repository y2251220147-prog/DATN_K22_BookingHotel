"use client";
import React, { useState } from "react";
import TableRoom from "./components/TableRoom";
import CreateRoom from "./components/CreateRoom";
import useSWR from "swr";
import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import Pagination from "@/app/(dashboard)/components/Pagination/Pagination";
import { RoomTypeFilter, type RoomTypeOption } from "./components/RoomTypeFilter";
import { StatusFilter } from "./components/StatusFilter";
import LimitSelector from "@/app/(dashboard)/components/Pagination/SelectRecord";

const Page = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const params = new URLSearchParams();

  selectedRoomTypes.forEach((item) => params.append("roomType", item));
  const { data: dataRoom } = useSWR(
    `/api/room?search=${search}&limit=${limit}&page=${page}&${params.toString()}&status=${selectedStatuses}`,
  );
  const { data: DataTypeRoom, error: roomTypeError, isLoading: roomTypesLoading } = useSWR<RoomTypeOption[]>(`/api/roomtype/dropdown/list`);

  const totalPages: number = dataRoom?.room?.pagination?.totalPages || 1;

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="lg:flex lg:justify-between items-center my-5">
        <div className="flex items-center gap-4 flex-wrap">
          <SearchForm
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            placeholder="Nhập Số Phòng Tại Đây ...."
          />

          <RoomTypeFilter
            className="w-full lg:w-60 mb-2"
            placeholder="Chọn loại phòng"
            showCapacity={true}
            options={DataTypeRoom ?? []}
            isLoading={roomTypesLoading}
            errorMessage={roomTypeError ? "Không tải được loại phòng. Vui lòng thử tải lại trang." : undefined}
            onTypeChange={setSelectedRoomTypes}
            selectedTypes={selectedRoomTypes}
          />
          <StatusFilter
            options={dataRoom?.room?.data || []}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            placeholder="Chọn trạng thái phòng"
            multiple={false}
            className="w-full lg:w-60 mb-2"
          />
        </div>

        <CreateRoom data={DataTypeRoom ?? []} />
      </div>

      <TableRoom
        rooms={dataRoom?.room?.data ?? []}
        data={DataTypeRoom || []}
      />
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      <LimitSelector value={limit} onChange={(value) => setLimit(value)} />
    </div>
  );
};

export default Page;
