// app/components/main/BeanHotel.tsx — Server Component
import Image from "next/image";
import TitleText from "../common/TitleText";
import { CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BeanData {
  stats: { value: string; label: string }[];
  features: string[];
  description: string[];
}

// ─── Fetch từ Google Sheets ───────────────────────────────────────────────────
async function fetchBeanData(): Promise<BeanData> {
  const sheetId = process.env.NEXT_PUBLIC_GGSHEETID;
  const apiKey = process.env.NEXT_PUBLIC_API_GGSHEET;

  if (!sheetId || !apiKey) return fallback;

  // Sheet "Bean": A2:B6 = stats, C2:C8 = features, D2:D6 = description paragraphs
  const ranges = ["Bean!A2:B6", "Bean!C2:C8", "Bean!D2:D6"];

  try {
    const results = await Promise.all(
      ranges.map((range) =>
        fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
          {
            next: { revalidate: 6 * 60 * 60 },
            cache: "force-cache",
            signal: AbortSignal.timeout(3000),
          },
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Google Sheets responded ${response.status}`);
          }
          return response.json();
        }),
      ),
    );

    return {
      stats: (results[0].values ?? []).map((r: string[]) => ({
        value: r[0],
        label: r[1],
      })),
      features: (results[1].values ?? [])
        .map((r: string[]) => r[0])
        .filter(Boolean),
      description: (results[2].values ?? [])
        .map((r: string[]) => r[0])
        .filter(Boolean),
    };
  } catch {
    return fallback;
  }
}

// ─── Fallback ────────────────────────────────────────────────────────────────
const fallback: BeanData = {
  stats: [
    { value: "5★", label: "Quốc tế" },
    { value: "24/7", label: "Hỗ trợ" },
    { value: "98%", label: "Hài lòng" },
    { value: "12+", label: "Năm KN" },
  ],
  features: [
    "Phòng nghỉ tiêu chuẩn quốc tế",
    "Nhà hàng ẩm thực Á – Âu",
    "Spa & Wellness cao cấp",
    "Phòng gym hiện đại",
    "Hội nghị & sự kiện doanh nghiệp",
    "Đưa đón sân bay 24/7",
  ],
  description: [
    "DAU Hotel — điểm dừng chân lý tưởng giữa trái tim TP. Đà Nẵng. Với vị trí chiến lược tại giao điểm của bốn quận trung tâm, khách sạn kết nối thuận tiện tới các khu thương mại, giải trí và văn hóa hàng đầu của thành phố.",
    "Mỗi phòng nghỉ tại DAU được thiết kế tỉ mỉ theo tiêu chuẩn quốc tế, trang bị nội thất cao cấp, tiện nghi hiện đại và dịch vụ phòng 24/7 để đảm bảo mọi nhu cầu của quý khách được chăm sóc tận tâm.",
    "Kiến trúc và không gian được chế tác hài hoà giữa phong cách đương đại và nét trang nhã Á — Âu, tạo nên bầu không khí thanh lịch nhưng vẫn ấm cúng, như ngôi nhà thứ hai của bạn.",
  ],
};

// ─── Orbit dots config ───────────────────────────────────────────────────────
const ORBIT_DOTS = [
  {
    size: "w-12 h-12 lg:w-20 lg:h-20",
    pos: "top-[14%] left-[10%] md:top-[4%]",
    color: "bg-red-400",
    opacity: "opacity-60",
  },
  {
    size: "w-6  h-6  lg:w-9  lg:h-9",
    pos: "top-[15%] right-[18%] md:top-[5%]",
    color: "bg-rose-300",
    opacity: "opacity-80",
  },
  {
    size: "w-9  h-9  lg:w-12 lg:h-12",
    pos: "bottom-[9%] right-[20%] md:bottom-[1%] ",
    color: "bg-red-500",
    opacity: "opacity-50",
  },
  {
    size: "w-5  h-5  lg:w-7  lg:h-7",
    pos: "bottom-[18%] left-[16%] md:bottom-[8%]",
    color: "bg-rose-400",
    opacity: "opacity-70",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default async function BeanHotel() {
  const data = await fetchBeanData();

  return (
    <div
      className="flex flex-col xl:flex-row items-center justify-center gap-10
      xl:my-24 py-10 px-4 xl:px-10"
    >
      {/* ── Circular image + orbit ───────────────────────────────────────── */}
      <div className="relative flex justify-center shrink-0">
        {/* Outer ring */}
        <div
          className="border-[3px] border-red-600 rounded-full
          w-68 h-68 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem]
          flex items-center justify-center relative"
        >
          {/* Main image */}
          <div
            className="relative w-55 h-55 lg:w-[24rem] lg:h-[24rem] xl:w-[28rem] xl:h-[28rem]
            rounded-full overflow-hidden ring-4 ring-white shadow-xl"
          >
            <Image
              src="/image/about.webp"
              alt="DAU Hotel"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Rotating dots — CSS animation */}
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite]">
            {ORBIT_DOTS.map((d, i) => (
              <div
                key={i}
                className={`absolute rounded-full ${d.size} ${d.pos} ${d.color} ${d.opacity}`}
              />
            ))}
          </div>

          {/* Counter-rotate stats badges so they stay upright */}
          <div
            className="absolute inset-0  lg:animate-[spin_18s_linear_infinite]
            pointer-events-none"
          >
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2
              bg-white border border-red-100 rounded-full px-3 py-1.5 shadow-md
              flex items-center gap-2 pointer-events-auto"
            >
              <span className="text-red-500 text-base font-bold leading-none">
                {data.stats[0]?.value}
              </span>
              <span className="text-xs text-gray-500">
                {data.stats[0]?.label}
              </span>
            </div>

            <div
              className="absolute top-1/2 -right-16 -translate-y-1/2
              bg-white border border-amber-100 rounded-full px-4 py-1.5 shadow-md
              flex items-center gap-2 pointer-events-auto"
            >
              <span className="text-amber-500 text-base font-bold leading-none">
                {data.stats[1]?.value}
              </span>
              <span className="text-xs text-gray-500">
                {data.stats[1]?.label}
              </span>
            </div>
            <div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2
              bg-white border border-green-100 rounded-full px-4 py-1.5 shadow-md
              flex items-center gap-2 pointer-events-auto"
            >
              <span className="text-green-600 text-base font-bold leading-none">
                {data.stats[2]?.value}
              </span>
              <span className="text-xs text-gray-500">
                {data.stats[2]?.label}
              </span>
            </div>
            <div
              className="absolute top-1/2 -left-16 -translate-y-1/2
              bg-white border border-blue-100 rounded-full px-1.5 py-1.5 shadow-md
              flex items-center gap-2 pointer-events-auto"
            >
              <span className="text-blue-600 text-lg font-bold leading-none">
                {data.stats[3]?.value}
              </span>
              <span className="text-xs text-gray-500">
                {data.stats[3]?.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Text content ─────────────────────────────────────────────────── */}
      <div className="w-full ">
        <TitleText
          title="DAU Hotel"
          tilteSub="Giới thiệu về chúng tôi"
          align="center"
        />

        {/* Description paragraphs */}
        <div className="space-y-4 mt-6 text-gray-600 leading-relaxed text-sm mx-4 md:mx-0 text-justify ">
          {data.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-2.5 mt-8 mx-4 md:mx-0">
          {data.features.map((f, i) => (
            <div key={i} className="flex justify-content items-center  gap-2.5">
              <CheckCircle size={16} className="text-green-500 shrink-0" />
              <span className="text-sm text-gray-700 text-center">{f}</span>
            </div>
          ))}
        </div>

        {/* Divider line */}
        <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            Since 2025 · Đà Nẵng
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
