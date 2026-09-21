import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, LogIn, LogOut, Search } from "lucide-react";

interface IFilterBooking {
  setDates: React.Dispatch<React.SetStateAction<Dates>>;
  dates: Dates;
  isNumber: string | number;
  setIsNumber: (value: string) => void;
}

type Dates = {
  checkInDate: Date | null;
  checkOutDate: Date | null;
};

const FilterBooking = ({
  dates,
  setDates,
  isNumber,
  setIsNumber,
}: IFilterBooking) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Bộ Lọc Tìm Kiếm</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Check-in Date */}
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <LogIn className="w-4 h-4 text-emerald-500" />
            Ngày Nhận Phòng
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            <DatePicker
              placeholderText="Chọn ngày nhận phòng"
              dateFormat="dd/MM/yyyy"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                         hover:border-emerald-300 transition-all duration-200 
                         text-gray-700 placeholder:text-gray-400"
              selected={dates.checkInDate}
              onChange={(date) =>
                setDates((prev) => ({
                  ...prev,
                  checkInDate: date,
                }))
              }
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <LogOut className="w-4 h-4 text-rose-500" />
            Ngày Trả Phòng
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CalendarDays className="w-5 h-5 text-gray-400" />
            </div>
            <DatePicker
              placeholderText="Chọn ngày trả phòng"
              dateFormat="dd/MM/yyyy"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 
                         hover:border-rose-300 transition-all duration-200 
                         text-gray-700 placeholder:text-gray-400"
              selected={dates.checkOutDate}
              onChange={(date) =>
                setDates((prev) => ({
                  ...prev,
                  checkOutDate: date,
                }))
              }
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* Search Customer */}
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Search className="w-4 h-4 text-blue-500" />
            Tìm Kiếm Khách Hàng
          </label>
          <SearchForm
            placeholder="Nhập số CCCD..."
            search={isNumber}
            setSearch={setIsNumber}
            resetPage
            className="w-full"
            setPage={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBooking;
