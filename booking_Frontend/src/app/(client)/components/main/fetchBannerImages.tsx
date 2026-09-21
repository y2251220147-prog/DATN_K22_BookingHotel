// app/components/main/BannerServer.tsx  (Server Component - không có "use client")
import BannerClient from "./Banner";

const FALLBACK_BANNERS = [
  "/image/banner1.jpg",
  "/image/banner2.jpg",
  "/image/banner3.jpg",
];

const HOME_CONTENT_REVALIDATE_SECONDS = 6 * 60 * 60;

async function fetchBannerImages(): Promise<string[]> {
  const range = "bannerHome!A2:C3";
  const sheetId = process.env.NEXT_PUBLIC_GGSHEETID;
  const apiKey = process.env.NEXT_PUBLIC_API_GGSHEET;

  if (!sheetId || !apiKey) return FALLBACK_BANNERS;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
      {
        cache: "force-cache",
        next: { revalidate: HOME_CONTENT_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!res.ok) throw new Error(`Google Sheets responded ${res.status}`);

    const data = await res.json();
    const images = data.values?.[0]?.filter(Boolean) ?? [];
    return images.length > 0 ? images : FALLBACK_BANNERS;
  } catch (error) {
    console.error("Error fetching banner images:", error);
    return FALLBACK_BANNERS;
  }
}

const BannerServer = async () => {
  const images = await fetchBannerImages();
  return <BannerClient images={images} />;
};

export default BannerServer;
