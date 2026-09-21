"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export default function HotelMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const position: L.LatLngTuple = [16.03240402720027, 108.22212446945628];

  useEffect(() => {
    if (!mapDivRef.current) return;

    // ✅ Xóa _leaflet_id cũ trên DOM nếu có — ngăn lỗi "already initialized"
    if ((mapDivRef.current as any)._leaflet_id) {
      (mapDivRef.current as any)._leaflet_id = null;
    }

    // ✅ Nếu map đã tồn tại thì không tạo lại
    if (mapRef.current) return;

    // Khởi tạo map thuần Leaflet — không dùng react-leaflet
    const map = L.map(mapDivRef.current, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Fix icon mặc định
    const icon = L.icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const marker = L.marker(position, { icon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;gap:8px">
        <h3 style="color:#2563eb;font-weight:bold;margin:0">DAU Hotel</h3>
        <p style="font-size:14px;margin:0">Vị trí tuyệt vời ngay mặt sông!</p>
        <a 
          href="https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}"
          target="_blank"
          style="background:#3b82f6;color:white;padding:6px 16px;border-radius:6px;text-decoration:none;font-weight:bold"
        >Đi Đến</a>
      </div>
    `);

    mapRef.current = map;

    // ✅ Cleanup đúng cách
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapDivRef}
      className="h-[500px] md:h-[700px] w-auto md:w-full mx-4 lg:mx-0 z-0 my-10 rounded-xl shadow-inner"
    />
  );
}
