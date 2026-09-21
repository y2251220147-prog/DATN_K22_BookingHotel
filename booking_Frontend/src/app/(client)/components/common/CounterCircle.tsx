import React from "react";

interface CounterProps {
  count: number | string;
  label: string;
  borderBottom?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  borderTop?: boolean;
}

export const CounterCircle: React.FC<CounterProps> = ({
  count,
  label,
  borderBottom = false,
  borderRight = false,
  borderLeft = false,
  borderTop = false,
}) => {
  const borderClasses = [
    borderBottom ? "border-b-[1px] border-b-[#94181C]" : "",
    borderRight ? "border-r-[1px] border-r-[#94181C]" : "",
    borderLeft ? "border-l-[1px] border-l-[#94181C]" : "",
    borderTop ? "border-t-[1px] border-t-[#94181C]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full w-40 h-40 lg:w-60 lg:h-60 border-[1px] border-[#EAEAEA] ${borderClasses}`}
    >
      <span className="text-2xl lg:text-4xl font-bold text-[#94181C]">
        {count}
      </span>
      <span className="text-xs mt-4 lg:text-lg text-black">{label}</span>
    </div>
  );
};
