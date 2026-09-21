"use client";
import { ReactNode, useState } from "react";

interface HeroSectionProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  backgroundImage?: string;
  className?: string;
  locale?: string;
  variant?: "default" | "gradient" | "minimal";
  overlayOpacity?: "light" | "medium" | "dark";
}

export function HeroSection({
  title,
  description,
  children,
  backgroundImage,
  className = "",
  variant = "default",
  overlayOpacity = "medium",
}: HeroSectionProps) {
  const overlayConfigs = {
    light: "bg-black/30",
    medium: "bg-black/50",
    dark: "bg-black/70",
  };

  const [openKeyword, setOpenKeyword] = useState(false);
  const gradientOverlay =
    variant === "gradient"
      ? "bg-linear-to-br from-blue-600/90 via-purple-600/80 to-pink-600/90"
      : overlayConfigs[overlayOpacity];

  return (
    <section
      className={`
        relative pt-24 pb-20 lg:pt-10 lg:pb-28
        bg-cover bg-center bg-no-repeat 
        lg:min-h-screen flex items-center justify-center
        overflow-hidden
        ${
          !backgroundImage && variant === "gradient"
            ? "bg-linear-to-br from-blue-600 via-purple-600 to-pink-600"
            : "bg-gray-900"
        }
        ${className}
      `}
      style={{
        backgroundImage: backgroundImage
          ? `url('${backgroundImage}')`
          : undefined,
      }}
    >
      {/* Multi-layer Overlay - CHỈ khi có ảnh VÀ KHÔNG phải default */}
      {backgroundImage && variant !== "default" && (
        <>
          {/* Layer 1: Dark overlay */}
          <div className={`absolute inset-0 ${gradientOverlay}`} />

          {/* Layer 2: Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-xs" />

          {/* Layer 3: Gradient overlay từ bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
        </>
      )}

      {/* Dark overlay đơn giản cho variant="default" */}
      {backgroundImage && variant === "default" && (
        <div className={`absolute inset-0 ${overlayConfigs[overlayOpacity]}`} />
      )}

      {/* Animated gradient orbs (decorative) */}
      {variant === "gradient" && !backgroundImage && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          {/* Title với text shadow */}
          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl
              font-extrabold tracking-tight 
              text-white
              mb-6 lg:mb-8
              leading-tight whitespace-pre-line
              animate-fade-in-up
              [text-shadow:0_2px_10px_rgb(0_0_0/40%)]
            "
          >
            {title}
          </h1>

          {/* Description với conditional blur */}
          {description && (
            <div
              className={`
                ${
                  variant !== "default"
                    ? "backdrop-blur-md"
                    : "backdrop-blur-none"
                } 
                bg-black/20 
                rounded-2xl p-6 mb-8 lg:mb-10 
                animate-fade-in-up animation-delay-200
                ${
                  openKeyword
                    ? "line-clamp-none"
                    : "line-clamp-10 lg:line-clamp-none"
                }
              `}
            >
              <p
                className="
                  text-lg sm:text-xl md:text-2xl
                  text-white
                  max-w-3xl
                  leading-relaxed
                  [text-shadow:0_1px_8px_rgb(0_0_0/30%)]
                  whitespace-pre-line
                "
              >
                {description}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          {children && (
            <div className="animate-fade-in-up animation-delay-400">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator với conditional blur */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        onClick={() => setOpenKeyword(!openKeyword)}
      >
        <div
          className={`
            flex flex-col items-center gap-2 text-white/90 animate-bounce 
            bg-black/20 rounded-full p-3 shadow-xl
            ${variant !== "default" ? "backdrop-blur-sm" : "backdrop-blur-none"}
          `}
        >
          <span className="text-sm font-medium hidden sm:block">
            {openKeyword ? "Thu gọn" : "Scroll"}
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
