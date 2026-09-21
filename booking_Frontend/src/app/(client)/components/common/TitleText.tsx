"use client";
import React from "react";

interface Iprops {
  title: string;
  tilteSub: string;
  align?: "left" | "center";
}

const TitleText = ({ title, tilteSub, align = "left" }: Iprops) => {
  const isCenter = align === "center";

  return (
    <div
      className={`relative select-none mb-4 ${isCenter ? "text-center" : "text-left"}`}
    >
      {/* Ghost text — watermark phía sau */}
      <p
        aria-hidden
        className="font-black tracking-tighter leading-none pointer-events-none
          text-[64px] md:text-[110px] lg:text-[130px]
          text-transparent [-webkit-text-stroke:1.5px_rgba(220,38,38,0.12)]"
      >
        {title}
      </p>

      {/* Main subtitle — overlay lên ghost */}
      <div
        className={`absolute inset-0 flex flex-col justify-center gap-1
        ${isCenter ? "items-center" : "items-start"} pl-1`}
      >
        {/* Accent line + sub label */}
        <div
          className={`flex items-center gap-3 ${isCenter ? "justify-center" : ""}`}
        >
          <span className="w-8 h-[2px] rounded-full bg-red-500 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
            {title}
          </span>
        </div>

        {/* Main heading */}
        <h2 className="font-serif font-medium text-2xl md:text-4xl text-gray-900 leading-tight">
          {tilteSub}
        </h2>
      </div>

      {/* Bottom spacing — giữ chiều cao tự nhiên của ghost text */}
      <div className="h-4 md:h-6" />
    </div>
  );
};

export default TitleText;
