"use client";
import useSWR from "swr";
import { useState } from "react";


type Period = "week" | "month" | "quarter" | "year";

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
  { label: "Quý", value: "quarter" },
  { label: "Năm", value: "year" },
];

const TOP_COLORS = [
  {
    bg: "bg-green-500",
    text: "text-white",
    revenue: "text-green-600",
    rowBg: "bg-green-50",
  },
  {
    bg: "bg-red-500",
    text: "text-white",
    revenue: "text-red-500",
    rowBg: "bg-red-50",
  },
  {
    bg: "bg-blue-500",
    text: "text-white",
    revenue: "text-blue-500",
    rowBg: "bg-blue-50",
  },
  {
    bg: "bg-orange-400",
    text: "text-white",
    revenue: "text-orange-500",
    rowBg: "bg-orange-50",
  },
  {
    bg: "bg-yellow-400",
    text: "text-white",
    revenue: "text-yellow-600",
    rowBg: "bg-yellow-50",
  },
] as const;

interface TopRoomType {
  id: string;
  name: string;
  totalRevenue: number;
  count: number;
}

interface TopRoom {
  id: string;
  roomNumber: number;
  roomTypeName: string;
  count: number;
}

interface TopRoomStatsResponse {
  topRoomTypes: TopRoomType[];
  topRooms: TopRoom[];
}

// --- Sub-components ---

const PeriodSelect = ({
  value,
  onChange,
}: {
  value: Period;
  onChange: (v: Period) => void;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as Period)}
    className="h-9 px-3 pr-8 rounded-full border border-gray-200 text-sm text-gray-700
      bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2
      focus:ring-blue-500 hover:bg-gray-50 transition-colors"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 5L7 9L11 5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
    }}
  >
    {PERIOD_OPTIONS.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const SkeletonRows = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
    ))}
  </>
);

const EmptyState = () => (
  <p className="text-center text-gray-400 text-sm py-8">Không có dữ liệu</p>
);

interface TopCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  period: Period;
  onPeriodChange: (v: Period) => void;
  isLoading: boolean;
  children: React.ReactNode;
}

const TopCard = ({
  icon,
  iconBg,
  iconColor,
  title,
  period,
  onPeriodChange,
  isLoading,
  children,
}: TopCardProps) => (
  <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <span className={`${iconColor} text-sm`}>{icon}</span>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <PeriodSelect value={period} onChange={onPeriodChange} />
    </div>
    <div className="space-y-2">{isLoading ? <SkeletonRows /> : children}</div>
  </div>
);

// --- Main component ---

const TopRoomStats = () => {
  const [periodType, setPeriodType] = useState<Period>("month");
  const [periodRoom, setPeriodRoom] = useState<Period>("month");

  const { data: typeData, isLoading: typeLoading } =
    useSWR<TopRoomStatsResponse>(
      `/api/dashboard/top-rooms?period=${periodType}`,
      {
        revalidateOnFocus: false,
      },
    );

  const { data: roomData, isLoading: roomLoading } =
    useSWR<TopRoomStatsResponse>(
      `/api/dashboard/top-rooms?period=${periodRoom}`,
      {
        revalidateOnFocus: false,
      },
    );

  const topRoomTypes = typeData?.topRoomTypes ?? [];
  const topRooms = roomData?.topRooms ?? [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-5">
      {/* Top doanh thu theo loại phòng */}
      <TopCard
        icon="💰"
        iconBg="bg-orange-100"
        iconColor="text-orange-500"
        title="Top doanh thu theo loại phòng"
        period={periodType}
        onPeriodChange={setPeriodType}
        isLoading={typeLoading}
      >
        {topRoomTypes.length === 0 ? (
          <EmptyState />
        ) : (
          topRoomTypes.map((item, index) => {
            const color = TOP_COLORS[index] ?? TOP_COLORS[4];
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${color.rowBg}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}
                  >
                    Top {index + 1}
                  </span>
                  <span className="text-sm text-gray-700 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className={`text-sm font-semibold ${color.revenue}`}>
                  {item.totalRevenue.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            );
          })
        )}
      </TopCard>

      {/* Top phòng thuê nhiều nhất */}
      <TopCard
        icon="🏨"
        iconBg="bg-blue-100"
        iconColor="text-blue-500"
        title="Top phòng thuê nhiều nhất"
        period={periodRoom}
        onPeriodChange={setPeriodRoom}
        isLoading={roomLoading}
      >
        {topRooms.length === 0 ? (
          <EmptyState />
        ) : (
          topRooms.map((item, index) => {
            const color = TOP_COLORS[index] ?? TOP_COLORS[4];
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${color.rowBg}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}
                  >
                    Top {index + 1}
                  </span>
                  <div>
                    <span className="text-sm text-gray-700 font-medium">
                      Phòng {item.roomNumber}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {item.roomTypeName}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${color.revenue}`}>
                  {item.count} lượt
                </span>
              </div>
            );
          })
        )}
      </TopCard>
    </div>
  );
};

export default TopRoomStats;
