"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pusherClient } from "@/lib/pusher";

const URL_API = process.env.NEXT_PUBLIC_URL_API;

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  // Unlock autoplay sau lần click đầu tiên của user
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      // Phát silent audio để unlock context
      const silent = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
      );
      silent
        .play()
        .then(() => {
          unlockedRef.current = true;
        })
        .catch(() => {});
    };

    window.addEventListener("click", unlock, { once: true });
    return () => window.removeEventListener("click", unlock);
  }, []);

  const speak = (text: string) => {
    if (typeof window === "undefined") return;

    fetch(`${URL_API}/api/chatai/tts?text=${encodeURIComponent(text)}`)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (buffer.byteLength === 0) return;

        const magicHex = Array.from(new Uint8Array(buffer.slice(0, 4)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        let audioType = "audio/mpeg";
        if (magicHex.startsWith("52494646")) audioType = "audio/wav";
        else if (magicHex.startsWith("4f676753")) audioType = "audio/ogg";
        else if (magicHex.startsWith("664c6143")) audioType = "audio/flac";

        const blob = new Blob([buffer], { type: audioType });
        const blobUrl = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.pause();
          URL.revokeObjectURL(audioRef.current.src);
        }

        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.onended = () => URL.revokeObjectURL(blobUrl);
        audio.onerror = () => URL.revokeObjectURL(blobUrl);

        if (unlockedRef.current) {
          audio.play().catch((e) => console.error("TTS play error:", e));
        } else {
          // Nếu chưa unlock thì queue lại, phát sau khi user click
          const playOnInteraction = () => {
            audio.play().catch(() => {});
            window.removeEventListener("click", playOnInteraction);
          };
          window.addEventListener("click", playOnInteraction, { once: true });
        }
      })
      .catch((e) => console.error("TTS fetch error:", e));
  };

  useEffect(() => {
    const channel = pusherClient.subscribe("admin-channel");

    channel.bind("new-booking", (data: any) => {
      setNotifications((prev) => [
        { id: Date.now(), ...data },
        ...prev.slice(0, 9),
      ]);
      speak(`Có đơn đặt phòng mới từ ${data.customer}`);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
          >
            <div className="p-2 max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center p-4">
                  Không có thông báo mới
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="border-b border-gray-100 p-3 hover:bg-gray-50"
                  >
                    <p className="font-medium text-sm text-gray-800">
                      🛏️ {n.customer} vừa đặt phòng {n.room}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setNotifications([])}
              className="w-full py-2 text-sm text-gray-600 hover:bg-gray-50 border-t"
            >
              Đánh dấu đã đọc
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
