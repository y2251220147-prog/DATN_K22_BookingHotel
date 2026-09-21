"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export function UpdateComponent() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="h-screen flex justify-center bg-white p-4 relative overflow-hidden">
      {/* Overlay decorative elements */}

      {/* Main Content */}
      <div
        className={`z-10 max-w-2xl transform transition-all duration-700 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Icon with animated pulse background */}
        <img
          src="/image/updatedWeb-removebg-preview.png"
          alt="updatedWeb.png"
          className="bg-center bg-no-repeat "
        />

        {/* Heading & description */}
        <h1 className="text-4xl  font-extrabold text-foreground mb-4 text-center">
          Page Updated &amp; Improved!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          Chúng tôi đã nâng cấp và thêm nhiều tính năng mới. Quay lại sau nhé!
        </p>

        {/* Loading dots with modern bounce */}
        <div className="flex justify-center mb-8 space-x-3">
          {["0s", "0.2s", "0.4s"].map((delay, index) => (
            <div
              key={index}
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: delay }}
            />
          ))}
        </div>

        {/* Button close */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsVisible(false)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:bg-primary/80 transition hover:-translate-y-0.5"
          >
            Đã hiểu rồi!
          </button>
        </div>

        {/* Decorative & motivational text */}
        <div className="mt-12 space-y-2 text-center text-sm text-muted-foreground">
          <p>🌟 Nhấn F5 để xem nội dung mới nhất</p>
          <p>🚧 Đang hoàn thiện, cảm ơn sự kiên nhẫn của bạn</p>
        </div>
      </div>
    </div>
  );
}
