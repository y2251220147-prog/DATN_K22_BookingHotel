// app/gallery/page.tsx  — Server Component, không có "use client"

import { HeroSection } from "../components/common/HeroSection";
import GalleryClient from "./components/GalleryClient";

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  category: string;
}

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  // Sau này bạn thay bằng range thật từ Google Sheets
  // VD: "Gallery!A2:D20" với cột A=src, B=title, C=description, D=category
  const range = "Gallery!A2:D20";
  const sheetId = process.env.NEXT_PUBLIC_GGSHEETID;
  const apiKey = process.env.NEXT_PUBLIC_API_GGSHEET;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
      { next: { revalidate: 3600 }, cache: "force-cache" },
    );
    const data = await res.json();

    if (!data.values) return fallbackImages;

    return data.values.map((row: string[]) => ({
      src: row[0] || "/placeholder.svg",
      title: row[1] || "",
      description: row[2] || "",
      category: row[3] || "Gallery",
    }));
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return fallbackImages; // dùng ảnh local nếu fetch lỗi
  }
}

// Dùng tạm ảnh local cho đến khi Sheets có dữ liệu
const fallbackImages: GalleryImage[] = Array.from({ length: 9 }, (_, i) => ({
  src: `/image/anh${i + 1}.jpg`,
  title: `Khoảnh khắc ${i + 1}`,
  description: "Không gian sang trọng và tiện nghi tại DAU Hotel.",
  category: "DAU Hotel",
}));

const GalleryPage = async () => {
  const images = await fetchGalleryImages();

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="h-[60vh] lg:h-screen overflow-hidden">
        <HeroSection
          backgroundImage="/image/banner4.jpg"
          variant="default"
          overlayOpacity="light"
          title="Thư Viện Ảnh"
          description="DAU Hotel – nơi hội tụ vẻ đẹp, sự sang trọng và dịch vụ đẳng cấp, mang đến trải nghiệm lưu trú khác biệt trong từng khoảnh khắc"
        />
      </div>

      {/* Gallery — Client Component nhận data từ server */}
      <GalleryClient images={images} />
    </section>
  );
};

export default GalleryPage;
