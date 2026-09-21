import { formatPrice } from "@/lib/formatPrice";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface RevenueTotalMonthProps {
  data: { months: string[]; data: number[] };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-orange-500">
          {payload[0].value.toLocaleString("vi-VN")}₫
        </p>
      </div>
    );
  }
  return null;
};

const RevenueTotalMonth: React.FC<RevenueTotalMonthProps> = ({ data }) => {
  const chartData = data.months.map((month, index) => ({
    months: month,
    data: data.data[index] || 0,
  }));

  return (
    <div className="bg-white shadow-xl hover:shadow-2xl duration-300 rounded-2xl mt-5 p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Biểu đồ doanh thu theo tháng
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-xs text-orange-500 font-medium">Doanh thu</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="months"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(0)}M`
                : v >= 1_000
                  ? `${(v / 1_000).toFixed(0)}K`
                  : v
            }
            width={45}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#fed7aa", strokeWidth: 1.5 }}
          />
          <Line
            type="monotone"
            dataKey="data"
            stroke="url(#lineGlow)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#f97316",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTotalMonth;
