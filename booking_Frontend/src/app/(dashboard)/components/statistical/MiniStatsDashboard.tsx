"use client";

import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ColumnType = "number" | "currency" | "percent" | "text";

type TableColumn = {
  key: string;
  label: string;
  type?: ColumnType;
};

type TableData = {
  title: string;
  columns: TableColumn[];
  rows: Array<Record<string, any>>;
};

export type ChartDef = {
  type: "pie" | "bar";
  title: string;
  dataKey: string; // e.g. "total" | "value"
  nameKey: string; // e.g. "methodLabel" | "metric"
  valueType?: "currency" | "number"; // default: auto-detect
  data: Array<Record<string, any>>;
};

export type MiniStatsTablePayload = {
  kind: "MINI_STATS_TABLE";
  period: {
    label: string;
    from: string;
    to: string;
    timezone?: string;
  };
  tables: TableData[];
  charts?: ChartDef[];
};

/* ─── helpers ─────────────────────────────────────────────── */
function detectCellType(
  col: TableColumn,
  row: Record<string, any>,
): ColumnType {
  return (row?.type as ColumnType) || col.type || "text";
}

function renderCell(value: any, type: ColumnType) {
  if (value === null || value === undefined || value === "") return "—";
  if (type === "currency") return formatPrice(Number(value) || 0);
  if (type === "percent") return `${Number(value) || 0}%`;
  if (type === "number")
    return new Intl.NumberFormat("vi-VN").format(Number(value) || 0);
  return String(value);
}

function isKpiTable(t: TableData) {
  return (
    t.rows?.length > 0 &&
    t.rows.every(
      (r) =>
        Object.prototype.hasOwnProperty.call(r, "metric") &&
        Object.prototype.hasOwnProperty.call(r, "value"),
    )
  );
}

/* ─── chart value helpers ─────────────────────────────────── */
/**
 * Auto-detect whether a chart's dataKey holds currency or plain numbers.
 * Heuristic: if any value > 100_000 → likely currency (VND).
 * Can be overridden by explicit chart.valueType.
 */
function detectChartValueType(chart: ChartDef): "currency" | "number" {
  if (chart.valueType) return chart.valueType;
  const max = Math.max(...chart.data.map((d) => Number(d[chart.dataKey]) || 0));
  return max >= 100_000 ? "currency" : "number";
}

function formatChartValue(value: any, vt: "currency" | "number"): string {
  const n = Number(value) || 0;
  if (vt === "currency") return formatPrice(n);
  return new Intl.NumberFormat("vi-VN").format(n);
}

/* ─── KPI accent colours ───────────────────────────────────── */
const KPI_ACCENTS = [
  {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-600",
    dot: "#6366f1",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    dot: "#10b981",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    dot: "#f59e0b",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    dot: "#f43f5e",
  },
  {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    dot: "#0ea5e9",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-600",
    dot: "#8b5cf6",
  },
];

const CHART_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#0ea5e9",
  "#8b5cf6",
];

/* ─── KPI Cards ────────────────────────────────────────────── */
function KpiCards({ table }: { table: TableData }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
      {table.rows.map((r, idx) => {
        const accent = KPI_ACCENTS[idx % KPI_ACCENTS.length];
        const isCurrency = (r?.type as ColumnType) === "currency";
        const value = isCurrency
          ? formatPrice(Number(r.value || 0))
          : renderCell(r.value, "number");

        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${accent.border} ${accent.bg} p-4 shadow-sm transition-shadow hover:shadow-md`}
          >
            {/* decorative circle */}
            <span
              className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10"
              style={{ backgroundColor: accent.dot }}
            />
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {r.metric}
            </p>
            <p
              className={`mt-2 text-xl font-bold leading-tight sm:text-2xl ${accent.text}`}
            >
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Data Table ───────────────────────────────────────────── */
function DataTable({ table }: { table: TableData }) {
  const { columns, rows } = table;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">{table.title}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {rows?.length || 0} dòng
        </span>
      </div>

      {/* scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-white">
              {columns.map((c, idx) => (
                <th
                  key={c.key}
                  className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 ${idx === 0 ? "text-left" : "text-center"
                    }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {(!rows || rows.length === 0) && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
            {rows?.map((r, i) => (
              <tr key={i} className="transition-colors hover:bg-indigo-50/40">
                {columns.map((c) => {
                  const type = detectCellType(c, r);
                  const raw = r?.[c.key];
                  const text = renderCell(raw, type);
                  const isNumeric =
                    type === "currency" ||
                    type === "number" ||
                    type === "percent";

                  return (
                    <td
                      key={c.key}
                      className={[
                        "whitespace-nowrap px-4 py-3 text-sm",
                        isNumeric
                          ? "text-center tabular-nums font-medium text-gray-700"
                          : "text-left text-gray-600",
                      ].join(" ")}
                    >
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ───────────────────────────────────────── */
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

function CustomTooltip({ active, payload, label, valueType }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg text-sm">
      {label && <p className="mb-1 font-medium text-gray-700">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color || p.stroke }}>
          {p.name}:{" "}
          <span className="font-semibold">
            {formatChartValue(p.value, valueType)}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ─── Chart Card ──────────────────────────────────────────── */
function ChartCard({ chart }: { chart: ChartDef }) {
  const vt = detectChartValueType(chart);

  // YAxis tick formatter — shorten large currency numbers
  const yTickFormatter = (v: number) => {
    if (vt === "currency") {
      if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}tr`;
      if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
    }
    return String(v);
  };

  // Stable render function — closes over `vt`, avoids passing extra prop through Recharts
  const renderTooltip = (props: TooltipProps<ValueType, NameType>) => (
    <CustomTooltip {...props} valueType={vt} />
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-800">{chart.title}</h3>
      </div>
      <div className="p-4">
        <div className="h-56 w-full sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chart.type === "pie" ? (
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey={chart.dataKey}
                  nameKey={chart.nameKey}
                  cx="50%"
                  cy="50%"
                  outerRadius="65%"
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name}\n${(Number(percent) * 100).toFixed(0)}%`
                  }
                  labelLine={true}
                >
                  {chart.data.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                />
              </PieChart>
            ) : chart.type === "bar" ? (
              <BarChart
                data={chart.data}
                barSize={32}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey={chart.nameKey}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={yTickFormatter}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  width={vt === "currency" ? 44 : 32}
                />
                <Tooltip content={renderTooltip} cursor={{ fill: "#f3f4f6" }} />
                <Bar
                  dataKey={chart.dataKey}
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                >
                  {chart.data.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div />
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────── */
import { exportDashboardToExcel } from "@/lib/exportExcel";

export function MiniStatsDashboard({
  payload,
}: {
  payload: MiniStatsTablePayload;
}) {
  const fromText = formatDate(payload.period.from);
  const toText = formatDate(payload.period.to);

  const kpi = payload.tables.find(isKpiTable);
  const rest = payload.tables.filter((t) => t !== kpi);

  const handleExportExcel = async () => {
    await exportDashboardToExcel(payload, "BEAN HOTEL & SPA");
  };

  return (
    <div className="space-y-4 px-0 sm:space-y-5">
      {/* Period header */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 shadow-sm sm:p-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-200">
              Báo cáo
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-white sm:text-xl">
              {payload.period.label}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-indigo-100 sm:text-sm">
            <div className="flex items-center gap-1">
              <span className="rounded-md bg-white/10 px-2 py-1">{fromText}</span>
              <span className="text-indigo-300">→</span>
              <span className="rounded-md bg-white/10 px-2 py-1">{toText}</span>
            </div>

            <button
              onClick={handleExportExcel}
              className="mt-1 flex items-center gap-1 rounded bg-white px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Xuất Excel
            </button>

          </div>
        </div>
      </div>

      {/* KPI cards */}
      {kpi && <KpiCards table={kpi} />}

      {/* Data tables — 1 col on mobile, 2 col on lg */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rest.map((t, idx) => (
            <DataTable key={idx} table={t} />
          ))}
        </div>
      )}

      {/* Charts — 1 col on mobile, 2 col on lg */}
      {payload.charts && payload.charts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {payload.charts.map((chart: ChartDef, index: number) => (
            <ChartCard key={index} chart={chart} />
          ))}
        </div>
      )}
    </div>
  );
}
