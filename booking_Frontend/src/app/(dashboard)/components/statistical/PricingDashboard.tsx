"use client";

import { formatPrice } from "@/lib/formatPrice";
import { Star } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────
interface Segment {
  comp_count: number;
  p25: number;
  p50: number;
  p75: number;
  is_fallback: boolean;
  note: string;
}

interface RoomResult {
  type: string;
  tier: string;
  room_count: number;
  my_avg: number;
  suggested: number;
  diff_pct: number;
  percentile: number;
  position: string;
  action: "Tăng giá" | "Giảm giá" | "Giữ nguyên";
  segment: Segment;
}

interface Market {
  total: number;
  min: number;
  p25: number;
  p50: number;
  p75: number;
  max: number;
  avg: number;
}

interface Competitor {
  name: string;
  price: number;
  stars: number;
}

interface Demand {
  multiplier: number;
  reasons: string[];
}

interface Meta {
  raw_comp_count: number;
  cleaned_comp_count: number;
  outliers_removed: number;
}

interface AnalysisData {
  ok: boolean;
  market: Market;
  rooms: RoomResult[];
  demand?: Demand;
  meta: Partial<Meta>;
}

interface ApiResponse {
  my_rooms: { room: string; type: string; price: number }[];
  competitors: { name: string; price: number; stars: number }[];
  ai_suggestion: AnalysisData;
  last_updated: string;
}

// ── Helpers ───────────────────────────────────────────────────────────
const BASE = "http://127.0.0.1:8000/api/price";

const fmtK = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + "M"
    : Math.round(n / 1000) + "k";
const todayStr = () => new Date().toISOString().split("T")[0];
const threeDaysLaterStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
};

// ── Sub-components ────────────────────────────────────────────────────

function ActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    "Tăng giá": "bg-emerald-600 text-white shadow-sm",
    "Giảm giá": "bg-red-600 text-white shadow-sm",
    "Giữ nguyên": "bg-black text-white shadow-sm",
  };
  const icons: Record<string, string> = {
    "Tăng giá": "↑",
    "Giảm giá": "↓",
    "Giữ nguyên": "—",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${styles[action] ?? styles["Giữ nguyên"]}`}
    >
      {icons[action]} {action}
    </span>
  );
}

function PercentileBar({ value }: { value: number }) {
  const color =
    value < 25
      ? "bg-emerald-500"
      : value < 50
        ? "bg-blue-500"
        : value < 75
          ? "bg-amber-500"
          : "bg-red-500";
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.max(value, 2)}%` }}
        />
      </div>
      <span className="text-[11px] text-zinc-900 font-bold font-mono tabular-nums w-7 text-right">
        {value}%
      </span>
    </div>
  );
}

function MarketBar({ market }: { market: Market }) {
  const range = market.max - market.min || 1;
  const pos = (v: number) => `${((v - market.min) / range) * 100}%`;
  return (
    <div className="mt-6 mb-2">
      <div className="relative h-2 bg-zinc-200 rounded-full">
        <div
          className="absolute h-full bg-blue-200 rounded-full border-x-2 border-blue-400"
          style={{
            left: pos(market.p25),
            width: `${((market.p75 - market.p25) / range) * 100}%`,
          }}
        />
        <div
          className="absolute w-1 h-4 bg-blue-600 top-1/2 -translate-y-1/2 rounded-full"
          style={{ left: pos(market.p50) }}
        />
      </div>
      <div className="flex justify-between mt-3 text-[11px] font-mono font-bold">
        <span className="text-zinc-600">{fmtK(market.min)}</span>
        <span className="text-zinc-700">P25 {fmtK(market.p25)}</span>
        <span className="text-blue-700">P50 {fmtK(market.p50)}</span>
        <span className="text-zinc-700">P75 {fmtK(market.p75)}</span>
        <span className="text-zinc-600">{fmtK(market.max)}</span>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-50">
      {[44, 28, 28, 20, 44, 24].map((pct, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-3.5 bg-zinc-100 rounded-full animate-pulse"
            style={{ width: `${pct}%`, minWidth: 48 }}
          />
        </td>
      ))}
    </tr>
  );
}

function StatCard({
  label,
  value,
  color,
  note,
}: {
  label: string;
  value: number | string;
  color: string;
  note?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-zinc-200 p-5 shadow-sm">
      <p className="text-xs text-zinc-900 font-bold tracking-wide uppercase mb-2">
        {label}
      </p>
      <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
      {note && <p className="text-xs text-zinc-500 mt-1 font-medium">{note}</p>}
    </div>
  );
}

// ── Refresh status badge ──────────────────────────────────────────────
type RefreshState = "idle" | "triggering" | "polling" | "done" | "error";

// ── Main Component ────────────────────────────────────────────────────
export default function PricingDashboard() {
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(threeDaysLaterStr);
  const [tab, setTab] = useState<"rooms" | "competitors">("rooms");

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshState, setRefreshState] = useState<RefreshState>("idle");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch analysis data ───────────────────────────────────────────
  const fetchData = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${BASE}/analysis?check_in=${checkIn}&check_out=${checkOut}`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApiResponse = await res.json();
        setData(json);
        return json;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không kết nối được API");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [checkIn, checkOut],
  );

  // ── Initial load ──────────────────────────────────────────────────
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // ── Cleanup polling on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Reset khi đổi ngày ───────────────────────────────────────────
  const handleDateChange = (setter: (v: string) => void, value: string) => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setRefreshState("idle");
    setter(value);
  };

  // ── Derived ───────────────────────────────────────────────────────
  const analysis = data?.ai_suggestion;
  const market = analysis?.market;
  const countAction = (a: string) =>
    analysis?.rooms?.filter((r) => r.action === a).length ?? 0;

  return (
    <div
      className="min-h-screen bg-white text-zinc-800"
      style={{ fontFamily: "'DM Sans', 'Be Vietnam Pro', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ── Topbar ── */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-20 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Date inputs */}
            {[
              {
                label: "Check-in",
                val: checkIn,
                set: (v: string) => handleDateChange(setCheckIn, v),
              },
              {
                label: "Check-out",
                val: checkOut,
                set: (v: string) => handleDateChange(setCheckOut, v),
              },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-400 hidden sm:block">
                  {f.label}
                </span>
                <input
                  type="date"
                  value={f.val}
                  min={
                    f.label === "Check-in"
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  onChange={(e) => f.set(e.target.value)}
                  className="text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                />
              </div>
            ))}

            {/* Refresh button/badge */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-7 space-y-5">
        {/* ── Page title ── */}
        <div className="flex items-end justify-between flex-wrap gap-3 border-b-2 border-zinc-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              Phân tích giá thị trường
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              {data?.last_updated
                ? `Cập nhật lúc ${data.last_updated}`
                : "So sánh với đối thủ Agoda theo thời gian thực"}
            </p>
          </div>
          {analysis?.demand && analysis.demand.multiplier > 1.01 && (
            <div className="flex items-center gap-3 bg-black text-white rounded-xl px-5 py-3 shadow-md">
              <span className="text-amber-400 text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold">
                  Nhu cầu thị trường tăng ×
                  {analysis.demand.multiplier.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-400">
                  {analysis.demand.reasons.join(" · ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Cần tăng giá"
            value={loading ? "—" : countAction("Tăng giá")}
            color="text-emerald-600"
            note="loại phòng"
          />
          <StatCard
            label="Cần giảm giá"
            value={loading ? "—" : countAction("Giảm giá")}
            color="text-red-500"
            note="loại phòng"
          />
          <StatCard
            label="Giữ nguyên"
            value={loading ? "—" : countAction("Giữ nguyên")}
            color="text-zinc-500"
            note="loại phòng"
          />
          <StatCard
            label="Đối thủ theo dõi"
            value={loading ? "—" : (data?.competitors.length ?? "—")}
            color="text-blue-600"
            note="khách sạn Agoda"
          />
        </div>

        {/* ── Market Overview ── */}
        <div className="bg-white rounded-2xl border-2 border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
              Tổng quan thị trường
            </h2>
            <div className="flex items-center gap-2">
              {(analysis?.meta?.outliers_removed ?? 0) > 0 && (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  Đã loại {analysis!.meta.outliers_removed} outlier
                </span>
              )}
              {market && (
                <span className="text-xs font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
                  {market.total} Khách sạn
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-zinc-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : market ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  {
                    label: "Min",
                    value: market.min,
                    muted: true,
                    accent: false,
                  },
                  {
                    label: "P25",
                    value: market.p25,
                    muted: false,
                    accent: false,
                  },
                  {
                    label: "P50 · Median",
                    value: market.p50,
                    muted: false,
                    accent: true,
                  },
                  {
                    label: "P75",
                    value: market.p75,
                    muted: false,
                    accent: false,
                  },
                  {
                    label: "Max",
                    value: market.max,
                    muted: true,
                    accent: false,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-xl p-4 text-center border-2 transition-all ${
                      s.accent
                        ? "bg-black border-black text-white shadow-md"
                        : "bg-zinc-50 border-zinc-200"
                    }`}
                  >
                    <p
                      className={`text-xs mb-1.5 font-bold uppercase ${s.accent ? "text-zinc-300" : "text-zinc-600"}`}
                    >
                      {s.label}
                    </p>
                    <p
                      className={`text-base font-black font-mono tabular-nums ${
                        s.accent ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {fmtK(s.value)}
                    </p>
                  </div>
                ))}
              </div>
              <MarketBar market={market} />
            </>
          ) : null}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 bg-zinc-100 rounded-xl p-1 w-fit border border-zinc-200">
          {(["rooms", "competitors"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                tab === t
                  ? "bg-black text-white shadow-md"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-200/50"
              }`}
            >
              {t === "rooms"
                ? `Phòng của bạn (${analysis?.rooms?.length ?? "…"})`
                : `Đối thủ (${data?.competitors?.length ?? "…"})`}
            </button>
          ))}
        </div>

        {/* ── Rooms Table ── */}
        {tab === "rooms" && (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 bg-zinc-100">
                  {[
                    "Loại phòng",
                    "Giá TB",
                    "Đề xuất",
                    "Chênh",
                    "Vị thế",
                    "Hành động",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-[11px] font-bold text-zinc-700 uppercase tracking-wider ${i > 0 && i < 4 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonRow key={i} />)
                  : analysis?.rooms.map((r, idx) => (
                      <tr
                        key={r.type}
                        className={`hover:bg-zinc-50 transition-colors ${idx < analysis.rooms.length - 1 ? "border-b border-zinc-200" : ""}`}
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-zinc-900 text-base">
                            {r.type}
                          </p>
                          <p className="text-xs text-zinc-600 mt-1 font-medium">
                            {r.room_count} phòng
                            {r.segment.is_fallback ? (
                              <span className="ml-1 text-amber-600 font-bold">
                                · ⚠ Không có đối thủ cùng phân khúc
                              </span>
                            ) : (
                              <span className="ml-1 text-zinc-800">
                                · {r.segment.comp_count} đối thủ cùng phân khúc
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="font-mono text-base font-bold text-zinc-700 tabular-nums">
                            {formatPrice(r.my_avg)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="font-mono text-base font-black text-blue-700 tabular-nums bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {formatPrice(r.suggested)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span
                            className={`font-mono text-base font-black tabular-nums px-2 py-1 rounded border ${
                              r.diff_pct > 0
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : r.diff_pct < 0
                                  ? "text-red-700 bg-red-50 border-red-200"
                                  : "text-zinc-700 bg-zinc-100 border-zinc-200"
                            }`}
                          >
                            {r.diff_pct > 0 ? "+" : ""}
                            {r.diff_pct.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-5 min-w-[176px]">
                          <p className="text-xs font-bold text-zinc-700 mb-1.5">
                            {r.position}
                          </p>
                          <PercentileBar value={r.percentile} />
                        </td>
                        <td className="px-6 py-5">
                          <ActionBadge action={r.action} />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Competitors Table ── */}
        {tab === "competitors" && (
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 bg-zinc-100">
                  {["Khách sạn", "Sao", "Giá / đêm", "So với P50"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-4 text-[11px] font-bold text-zinc-700 uppercase tracking-wider ${i === 2 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
                  : data?.competitors.map((c, idx) => {
                      const p50 = market?.p50 ?? 1;
                      const diffPct = ((c.price - p50) / p50) * 100;
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-zinc-50 transition-colors ${idx < data.competitors.length - 1 ? "border-b border-zinc-200" : ""}`}
                        >
                          <td className="px-6 py-5 max-w-xs">
                            <span className="text-zinc-900 font-bold line-clamp-1 block text-base">
                              {c.name}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < c.stars ? "fill-amber-400 text-amber-400" : "fill-zinc-100 text-zinc-200"}`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="font-mono text-base font-black text-zinc-900 tabular-nums">
                              {formatPrice(c.price)}
                            </span>
                          </td>
                          <td className="px-6 py-5 min-w-[160px]">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden border border-zinc-300">
                                <div
                                  className={`h-full rounded-full ${diffPct >= 0 ? "bg-amber-500" : "bg-blue-600"}`}
                                  style={{
                                    width: `${Math.min(Math.abs(diffPct) / 3, 100)}%`,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-xs font-mono tabular-nums w-12 text-right font-bold ${diffPct >= 0 ? "text-amber-700" : "text-blue-700"}`}
                              >
                                {diffPct > 0 ? "+" : ""}
                                {diffPct.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center text-[11px] text-zinc-300 pb-4">
          Dữ liệu từ Agoda · Phân tích bởi PriceIQ
        </p>
      </div>
    </div>
  );
}
