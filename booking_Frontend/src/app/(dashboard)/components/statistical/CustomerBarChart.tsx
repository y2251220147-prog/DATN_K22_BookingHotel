import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CustomerBarChartProps {
  data: {
    months: string[];
    counts: number[];
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-violet-500">
          {payload[0].value.toLocaleString("vi-VN")} khách
        </p>
      </div>
    );
  }
  return null;
};

const CustomerBarChart = ({ data }: CustomerBarChartProps) => {
  const chartData = data.months.map((month, i) => ({
    month,
    customers: data.counts[i] || 0,
  }));

  const total = data.counts.reduce((sum, val) => sum + val, 0);
  const maxVal = Math.max(...data.counts);

  return (
    <div className="bg-white shadow-xl hover:shadow-2xl duration-300 rounded-2xl mt-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Biểu đồ khách hàng theo tháng
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tổng:{" "}
            <span className="text-violet-500 font-medium">
              {total.toLocaleString("vi-VN")} khách
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-xs text-violet-500 font-medium">
            Khách hàng
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
          <Bar dataKey="customers" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.customers === maxVal
                    ? "url(#barGradientActive)"
                    : "url(#barGradient)"
                }
                opacity={entry.customers === maxVal ? 1 : 0.75}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerBarChart;
