"use client";
import React, { useEffect, useRef } from "react";
import { Filter } from "lucide-react";

interface StatusOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string; // Tiêu đề hiển thị, ví dụ "Trạng thái"
  options: StatusOption[]; // Danh sách tuỳ chọn
  selected: string; // Trạng thái được chọn
  onChange: (value: string) => void; // Callback khi chọn / bỏ chọn
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  filterOpen,
  setFilterOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOpen]);

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        {label}
        <button onClick={() => setFilterOpen(!filterOpen)} className="ml-1">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {filterOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 mt-2 w-40 bg-white border rounded shadow p-2 z-50"
        >
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center text-gray-700 space-x-2 text-xs p-0.5"
            >
              <input
                type="checkbox"
                checked={selected === opt.value}
                onChange={() => {
                  if (selected === opt.value) {
                    onChange(""); // bỏ chọn
                  } else {
                    onChange(opt.value); // chọn
                  }
                }}
              />
              <span>{opt.label.toLowerCase()}</span>
            </label>
          ))}

          <div className="flex justify-between mt-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded text-xs text-red-500"
              onClick={() => onChange("")}
            >
              Xóa
            </button>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              onClick={() => setFilterOpen(false)}
            >
              Lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
