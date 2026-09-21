"use client";
import React, { useState } from "react";
import { Building2, X, Check } from "lucide-react";

interface ISelectMultiRooms {
  onChange: (selectedRoomIds: string[]) => void;
  data: any[];
  value: string[];
  label?: string;
  placeholder?: string;
}

const SelectMultiRooms = ({
  value = [],
  onChange,
  data,
  label = "Chọn Phòng",
  placeholder = "Chọn một hoặc nhiều phòng...",
}: ISelectMultiRooms) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRoom = (roomId: string) => {
    if (value.includes(roomId)) {
      onChange(value.filter((id) => id !== roomId));
    } else {
      onChange([...value, roomId]);
    }
  };

  const removeRoom = (roomId: string) => {
    onChange(value.filter((id) => id !== roomId));
  };

  const filteredRooms = data?.filter((room) =>
    room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRooms = data?.filter((room) => value.includes(room.id));

  // ✅ Hàm chọn hoặc bỏ chọn tất cả
  const handleSelectAll = () => {
    const filteredIds = filteredRooms.map((r) => r.id);
    const allSelected = filteredIds.every((id) => value.includes(id));
    if (allSelected) {
      // Bỏ chọn tất cả trong danh sách lọc hiện tại
      onChange(value.filter((id) => !filteredIds.includes(id)));
    } else {
      // Chọn tất cả trong danh sách lọc hiện tại
      const newSelected = Array.from(new Set([...value, ...filteredIds]));
      onChange(newSelected);
    }
  };

  const allVisibleSelected =
    filteredRooms?.length > 0 &&
    filteredRooms.every((r) => value.includes(r.id));

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* Selected Rooms Display */}
      {selectedRooms && selectedRooms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Phòng {room.roomNumber}</span>
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Container */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-400 text-left flex items-center justify-between"
        >
          <span className="text-gray-700 font-medium flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            {selectedRooms && selectedRooms.length > 0
              ? `Đã chọn ${selectedRooms.length} phòng`
              : placeholder}
          </span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-hidden">
            {/* Search Box + Select All */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 space-y-2">
              <input
                type="text"
                placeholder="Tìm kiếm phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
              />

              {/* ✅ Nút Chọn tất cả / Bỏ chọn tất cả */}
              {filteredRooms.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
                >
                  {allVisibleSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              )}
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-60">
              {filteredRooms && filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const isSelected = value.includes(room.id);
                  return (
                    <button
                      key={room.id}
                      type="button"
                      name="roomIds"
                      onClick={() => toggleRoom(room.id)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            Phòng {room.roomNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tầng {room.floor} • {room.status}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Không tìm thấy phòng nào</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click Outside Handler */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SelectMultiRooms;
