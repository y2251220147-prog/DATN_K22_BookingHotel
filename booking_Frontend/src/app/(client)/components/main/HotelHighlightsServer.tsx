// app/components/main/HotelHighlightsServer.tsx
import HotelHighlightsCarousel from "./Hotel-Highlights";

const FALLBACK_HIGHLIGHTS = [
  {
    id: 1,
    title: "Không gian nghỉ dưỡng",
    description: "Không gian hiện đại, tiện nghi và thoải mái.",
    image: "/image/khong-gian-akuna-8225.jpg",
    icon: "✨",
    features: ["Dịch vụ 24/7", "Không gian sang trọng", "Vị trí thuận tiện"],
  },
];

async function fetchHighlights() {
  const range = "Hotel-Highlights!A2:H6";
  const sheetId = process.env.NEXT_PUBLIC_GGSHEETID;
  const apiKey = process.env.NEXT_PUBLIC_API_GGSHEET;

  if (!sheetId || !apiKey) return FALLBACK_HIGHLIGHTS;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
      {
        cache: "force-cache",
        next: { revalidate: 6 * 60 * 60 },
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!res.ok) throw new Error(`Google Sheets responded ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data.values) || data.values.length === 0) {
      return FALLBACK_HIGHLIGHTS;
    }

    return data.values.map((row: string[], index: number) => ({
      id: Number(row[0]) || index + 1,
      title: row[1],
      description: row[2],
      image: row[3],
      icon: row[4],
      features: [row[5], row[6], row[7]].filter(Boolean),
    }));
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return FALLBACK_HIGHLIGHTS;
  }
}

const HotelHighlightsServer = async () => {
  const highlights = await fetchHighlights();
  return <HotelHighlightsCarousel highlights={highlights} />;
};

export default HotelHighlightsServer;
