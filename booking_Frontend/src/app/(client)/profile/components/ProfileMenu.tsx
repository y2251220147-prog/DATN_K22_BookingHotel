"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ProfileSidebarItem {
  id: number;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface ProfileMenuProps {
  menuItems: ProfileSidebarItem[];
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ menuItems }) => {
  const pathname = usePathname();

  return (
    <nav className="flex lg:flex-col flex-row gap-1 justify-around lg:justify-start">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.id}
            href={item.path}
            className={[
              "group flex items-center gap-2.5 rounded-xl transition-colors duration-150",
              // Desktop: full row with label
              "lg:px-3 lg:py-2.5 lg:w-full",
              // Mobile: icon-only centered pill
              "px-3 py-3 lg:flex-row flex-col",
              isActive
                ? "bg-amber-50 text-amber-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
            ].join(" ")}
          >
            {item.icon && (
              <span
                className={[
                  "flex-shrink-0 transition-colors",
                  "lg:w-4 lg:h-4 w-5 h-5",
                  isActive
                    ? "text-amber-600"
                    : "text-gray-400 group-hover:text-gray-600",
                ].join(" ")}
              >
                {item.icon}
              </span>
            )}

            {/* Label — full text on desktop, ultra-short on mobile */}
            <span className="hidden lg:block text-sm font-medium leading-none">
              {item.label}
            </span>
            <span className="lg:hidden text-[10px] font-medium leading-tight text-center">
              {item.label.split(" ").slice(-1)[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default ProfileMenu;
