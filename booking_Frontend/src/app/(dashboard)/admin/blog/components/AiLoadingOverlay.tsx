/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface IAiLoading {
  loading: boolean;
}
const AiLoadingOverlay = ({ loading }: IAiLoading) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(
    "Đang khởi tạo ý tưởng bài viết...",
  );
  const [dots, setDots] = useState("");

  // Fake progress
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 2 : 100));
    }, 200);
    return () => clearInterval(timer);
  }, [loading]);

  // Fake text change
  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Đang khởi tạo ý tưởng bài viết...",
      "Phân tích chủ đề và tìm cảm hứng...",
      "Xây dựng dàn ý và bố cục nội dung...",
      "AI đang viết các đoạn mở bài hấp dẫn...",
      "Thêm chi tiết và ví dụ minh họa...",
      "Hoàn tất bài viết của bạn ✨",
    ];

    let index = 0;
    const msgInterval = setInterval(() => {
      if (index < messages.length - 1) {
        index++;
        setCurrentText(messages[index]);
      }
    }, 4000);
    return () => clearInterval(msgInterval);
  }, [loading]);

  // Dots animation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  // Khi loading = false → ép về 100% và “Hoàn tất xử lý!”
  useEffect(() => {
    if (!loading) {
      setProgress(100);
      setCurrentText("Hoàn tất xử lý!");
      setDots("");
    }
  }, [loading]);

  const backgrounds = [
    { id: "bg-process", src: "/image/bgProcess.svg" },
    { id: "bg-main", src: "/image/bg.gif" },
    { id: "bg-alt", src: "/image/bg1.gif" },
  ];

  return (
    <div className="absolute top-0 right-0 z-100">
      <div className="relative flex flex-col justify-between overflow-hidden bg-linear-to-b from-[#001848] to-[#004C97] text-white w-screen h-screen rounded-2xl shadow-2xl">
        {/* Backgrounds */}
        {backgrounds.map((bg) => (
          <img
            key={bg.id}
            src={bg.src}
            alt={bg.id}
            className={`absolute inset-0 w-full h-full opacity-80 ${
              bg.id === "bg-process" ? "object-fill" : "object-cover"
            }`}
          />
        ))}

        {/* ✅ Center content */}
        <div className="relative flex flex-col items-center justify-center flex-1 px-6 py-8 text-center z-10">
          <img
            src="/image/bot.gif"
            alt="AI Bot"
            className="w-40 h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 mb-6 animate-bounce-slow drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          />

          <div className="text-sm sm:text-md md:text-xl leading-relaxed">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentText}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {currentText}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress */}
        <div className="relative px-8 pb-20 flex flex-col items-center space-y-4 z-10">
          <ProgressBar progress={progress} />
          <ProgressMessage message={currentText} dots={dots} />
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ----------------------------------------------------

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="relative w-full max-w-xl h-8">
    <div className="absolute inset-0 rounded-full border border-[#3B93FF]" />
    <div className="relative z-10 flex items-center justify-center h-full rounded-full overflow-hidden">
      <div
        className="absolute left-[2px] top-[2px] bottom-[2px] transition-all duration-500 ease-in-out rounded-full"
        style={{
          width: `calc(${progress}% - 4px)`,
          background:
            "linear-gradient(270deg, #69E3FC 0%, #3B93FF 48.44%, #00078C 96.88%)",
        }}
      />
      <p className="absolute inset-0 flex items-center justify-center text-md font-semibold text-white drop-shadow-sm">
        {progress}%
      </p>
    </div>
  </div>
);

const ProgressMessage = ({
  message,
  dots,
}: {
  message: string;
  dots: string;
}) => (
  <p className="font-semibold tracking-wide drop-shadow-md flex items-center justify-center">
    <span className="bg-linear-to-r from-[#00FFF5] via-[#C7FFFD] to-[#00FFF5] bg-clip-text text-transparent flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(1rem,5vw,2rem)] max-w-full">
      <span className="inline-block">{message}</span>
      <span className="ml-1 w-7 inline-flex justify-start">{dots}</span>
    </span>
  </p>
);

export default AiLoadingOverlay;
