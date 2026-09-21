import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  online: number;
  offline: number;
}

interface BookingResourceChartProps {
  data: DataPoint[] | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 space-y-1.5">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-gray-500">
              {entry.dataKey === "online"
                ? "Booking online"
                : "Booking khách sạn"}
              :
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: entry.color }}
            >
              {entry.value.toLocaleString("vi-VN")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BookingResourceChart = ({ data }: BookingResourceChartProps) => {
  const chartData = useMemo(() => data || [], [data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white shadow-xl hover:shadow-2xl duration-300 rounded-2xl mt-5 p-6">
        <p className="text-center text-gray-400 text-sm">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl hover:shadow-2xl duration-300 rounded-2xl mt-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Biểu đồ đặt phòng online / khách sạn
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            So sánh lượng đặt phòng theo kênh
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-blue-400 inline-block rounded-full" />
            <span className="text-xs text-gray-500">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-0.5 bg-emerald-400 inline-block rounded-full" />
            <span className="text-xs text-gray-500">Khách sạn</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="onlineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="offlineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#e5e7eb", strokeWidth: 1.5 }}
          />
          <Line
            type="monotone"
            dataKey="online"
            stroke="url(#onlineGlow)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
          <Line
            type="monotone"
            dataKey="offline"
            stroke="url(#offlineGlow)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#10b981",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingResourceChart;
