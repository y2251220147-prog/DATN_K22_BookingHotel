// app/about/page.tsx — Server Component
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  MapPin,
  Wifi,
  Utensils,
  Car,
  Waves,
  Presentation,
  GalleryHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AboutData {
  stats: { value: string; label: string }[];
  services: { icon: string; label: string }[];
  awards: { logo: string; name: string }[];
  highlights: { image: string; title: string; desc: string }[];
}

// ─── Fetch từ Google Sheets ───────────────────────────────────────────────────
async function fetchAboutData(): Promise<AboutData> {
  const sheetId = process.env.NEXT_PUBLIC_GGSHEETID;
  const apiKey = process.env.NEXT_PUBLIC_API_GGSHEET;

  const ranges = [
    "About!A2:B10", // Stats:     col A = value, B = label
    "About!C2:D10", // Services:  col C = icon (emoji), D = label
    "About!E2:F6", // Awards:    col E = logo url, F = name
    "About!G2:I6", // Highlights: col G = image, H = title, I = desc
  ];

  try {
    const results = await Promise.all(
      ranges.map((range) =>
        fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
          { next: { revalidate: 3600 }, cache: "force-cache" },
        ).then((r) => r.json()),
      ),
    );

    return {
      stats: (results[0].values ?? []).map((r: string[]) => ({
        value: r[0],
        label: r[1],
      })),
      services: (results[1].values ?? []).map((r: string[]) => ({
        icon: r[0],
        label: r[1],
      })),
      awards: (results[2].values ?? []).map((r: string[]) => ({
        logo: r[0],
        name: r[1],
      })),
      highlights: (results[3].values ?? []).map((r: string[]) => ({
        image: r[0],
        title: r[1],
        desc: r[2],
      })),
    };
  } catch {
    return fallbackData;
  }
}

// ─── Fallback (dùng khi Sheets chưa có dữ liệu) ───────────────────────────────
const fallbackData: AboutData = {
  stats: [
    { value: "5★", label: "Hạng khách sạn quốc tế" },
    { value: "24/7", label: "Dịch vụ hỗ trợ liên tục" },
    { value: "98%", label: "Khách hàng hài lòng" },
    { value: "12+", label: "Năm kinh nghiệm" },
  ],
  services: [
    { icon: "🍽️", label: "Nhà hàng" },
    { icon: "🏊", label: "Hồ bơi" },
    { icon: "🎤", label: "Hội nghị" },
    { icon: "🚗", label: "Đưa đón sân bay" },
    { icon: "🧖", label: "Spa & Wellness" },
    { icon: "⛳", label: "Sân golf" },
    { icon: "📶", label: "Wifi tốc độ cao" },
    { icon: "🗺️", label: "Tour du lịch" },
  ],
  awards: [],
  highlights: [
    {
      image: "/image/anh1.jpg",
      title: "Hồ bơi vô cực",
      desc: "View biển tuyệt đẹp, mở cửa 6h–22h",
    },
    {
      image: "/image/anh2.jpg",
      title: "Nhà hàng The Pearl",
      desc: "Ẩm thực Á–Âu đỉnh cao tầng 20",
    },
    {
      image: "/image/anh3.jpg",
      title: "Spa & Wellness",
      desc: "Liệu pháp thư giãn truyền thống",
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────
const AboutPage = async () => {
  const data = await fetchAboutData();

  return (
    <section className="bg-white overflow-hidden">
      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-[88vh] flex items-center">
        {/* Fullscreen background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/alper-gio-thieu.webp"
            alt="DAU Hotel"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-5">
              <span className="w-8 h-px bg-amber-400" />
              Since 2025 · Đà Nẵng
            </span>

            <h1 className="font-serif text-5xl lg:text-7xl font-medium text-white leading-[1.1] mb-6">
              Nghỉ dưỡng
              <br />
              <span className="text-amber-400">đẳng cấp</span>
              <br />
              quốc tế
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Khách sạn 5 sao tọa lạc tại trung tâm Đà Nẵng — nơi hội tụ của sự
              sang trọng, tiện nghi và dịch vụ cá nhân hóa.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/rooms/18a8e9bc-b4e2-4597-9fd2-571eb3a32ead"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300
                  text-black text-sm font-semibold px-7 py-3.5 rounded-full
                  transition-all duration-200 hover:scale-[1.02]"
              >
                Đặt phòng ngay
                <span>→</span>
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 border border-white/30
                  hover:border-white/60 text-white text-sm font-medium px-6 py-3.5
                  rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                Xem thư viện ảnh
              </Link>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="absolute right-6 lg:right-10 bottom-12 hidden lg:flex flex-col gap-3">
            {data.stats.map((s) => (
              <div
                key={s.value}
                className="bg-white/10 backdrop-blur-md border border-white/20
                  rounded-2xl px-5 py-3 text-white min-w-[160px]"
              >
                <div className="text-2xl font-bold text-amber-400">
                  {s.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
          <span className="text-white/40 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>

      {/* ══ STATS (mobile) ════════════════════════════════════════════════════ */}
      <div className="lg:hidden grid grid-cols-2 gap-3 px-6 py-8 bg-slate-50">
        {data.stats.map((s) => (
          <div
            key={s.value}
            className="bg-white rounded-2xl p-5 border border-slate-100 text-center"
          >
            <div className="text-2xl font-bold text-amber-500">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══ ABOUT TEXT + HIGHLIGHTS ═══════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Về chúng tôi
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl font-medium text-slate-900 mt-3 mb-7 leading-tight">
            Hơn một chỗ nghỉ ngơi —<br />
            <span className="text-amber-500">một trải nghiệm sống</span>
          </h2>

          <div className="space-y-5 text-slate-600 leading-relaxed">
            <p>
              DAU Hotel là khách sạn 5 sao quốc tế tọa lạc tại giao điểm của bốn
              quận trung tâm Đà Nẵng, mang đến không gian nghỉ dưỡng tinh tế kết
              hợp giữa kiến trúc hiện đại và giá trị văn hóa địa phương.
            </p>
            <p>
              Mỗi phòng là một tác phẩm thiết kế riêng biệt — từ vật liệu cao
              cấp, ánh sáng tự nhiên đến tầm nhìn toàn cảnh thành phố hay bờ
              biển. Chúng tôi không cung cấp dịch vụ theo chuẩn — chúng tôi cá
              nhân hóa từng trải nghiệm cho mỗi vị khách.
            </p>
            <p>
              Từ nhà hàng fine dining, spa thư giãn, hội nghị chuyên nghiệp đến
              dịch vụ concierge 24/7 — mọi nhu cầu đều được đáp ứng với sự chu
              đáo và nhanh chóng bậc nhất.
            </p>
          </div>

          {/* Location badge */}
          <div
            className="mt-8 inline-flex items-center gap-2.5 border border-slate-200
            rounded-full px-4 py-2 text-sm text-slate-600 bg-slate-50"
          >
            <MapPin size={15} className="text-amber-500" />
            Giao điểm 4 quận trung tâm · TP. Đà Nẵng
          </div>
        </div>

        {/* Right: highlight grid */}
        {data.highlights.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {data.highlights.map((h, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 h-52" : "h-44"}`}
              >
                <Image
                  src={h.image || "/placeholder.svg"}
                  alt={h.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="font-medium text-sm">{h.title}</p>
                  <p className="text-xs text-white/70 mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Dịch vụ
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-slate-900 mt-2">
              Đầy đủ tiện ích cao cấp
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.services.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-slate-100 p-5
                  flex flex-col items-center gap-2.5 text-center
                  hover:border-amber-200 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm font-medium text-slate-700">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CTA BANNER ════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-amber-400 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/2 translate-y-1/2" />
        </div>
        <div
          className="relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row
          items-center justify-between gap-6"
        >
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-black">
              Sẵn sàng cho kỳ nghỉ trong mơ?
            </h2>
            <p className="text-black/60 mt-2">
              Đặt phòng ngay hôm nay và nhận ưu đãi đặc biệt dành cho khách mới.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/rooms/18a8e9bc-b4e2-4597-9fd2-571eb3a32ead"
              className="inline-flex items-center gap-2 bg-black hover:bg-slate-800
                text-white text-sm font-semibold px-7 py-3.5 rounded-full
                transition-all duration-200 hover:scale-[1.02]"
            >
              Đặt phòng ngay →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border-2 border-black/20
                hover:border-black/40 text-black text-sm font-medium px-6 py-3.5
                rounded-full transition-all duration-200"
            >
              Khám phá thêm
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
