import React from "react";

interface ILimitSelector {
  value: number;
  onChange: (value: number) => void;
}

const LimitSelector = ({ value, onChange }: ILimitSelector) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="limit-select" className="text-sm text-gray-500">
        Số lượng
      </label>
      <select
        id="limit-select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 px-3 pr-8 rounded-full border border-gray-200 text-sm text-gray-700
          bg-white appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:bg-gray-100 transition-colors"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 5L7 9L11 5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
        }}
      >
        {[10, 20, 30, 40, 50].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LimitSelector;
