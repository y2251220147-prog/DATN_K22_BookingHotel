import { Button } from "@/components/ui/button";
import React from "react";

interface SelectRangeStatisticalProps {
  setRange: (range: string) => void;
}
const SelectRangeStatistical: React.FC<SelectRangeStatisticalProps> = ({
  setRange,
}) => {
  return (
    <div className="flex items-center justify-start md:gap-2 gap-x-1 mb-4">
      <Button onClick={() => setRange("day")} variant={"outline"}>
        Ngày
      </Button>
      <Button onClick={() => setRange("week")} variant={"outline"}>
        Tuần
      </Button>
      <Button onClick={() => setRange("month")} variant={"outline"}>
        Tháng
      </Button>
      <Button onClick={() => setRange("year")} variant={"outline"}>
        Năm
      </Button>
    </div>
  );
};

export default SelectRangeStatistical;
