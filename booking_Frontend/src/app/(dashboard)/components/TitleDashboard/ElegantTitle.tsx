import React from "react";

interface TitleProps {
  title: string;
  className?: string;
  align?: "left" | "center" | "right";
}

const ElegantTitle: React.FC<TitleProps> = ({
  title,
  className = "",
  align = "left",
}) => {
  const alignMap: Record<typeof align, string> = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div
      className={`inline-flex flex-col gap-2 ${alignMap[align]} ${className}`}
    >
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 titleFont">
        {title}
      </h2>

      {/* gạch dưới mảnh, sang */}
      <div className="h-px w-10 md:w-12 bg-gray-900/70 dark:bg-gray-100/70" />

      {/* subline rất mờ, tạo chiều sâu */}
      <div className="h-px w-16 md:w-20 bg-gray-400/30 dark:bg-gray-500/30" />
    </div>
  );
};

export default ElegantTitle;
