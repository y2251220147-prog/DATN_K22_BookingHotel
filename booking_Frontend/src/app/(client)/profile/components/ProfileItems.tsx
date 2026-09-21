"use client";
import { useUserStore } from "@/hook/useUserStore";
import ProfileMenu from "./ProfileMenu";
import { User, CalendarCheck, KeyRound, Star } from "lucide-react";

interface ProfileSidebarItem {
  id: number;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const profileSidebarItems: ProfileSidebarItem[] = [
  {
    id: 1,
    label: "Thông tin cá nhân",
    path: "/profile",
    icon: <User size={16} />,
  },
  {
    id: 2,
    label: "Đơn đặt phòng",
    path: "/profile/bookings",
    icon: <CalendarCheck size={16} />,
  },
  {
    id: 3,
    label: "Cài đặt bảo mật",
    path: "/profile/change-password",
    icon: <KeyRound size={16} />,
  },
  {
    id: 4,
    label: "Đánh giá của tôi",
    path: "/profile/reviews",
    icon: <Star size={16} />,
  },
];

const ProfileItems = () => {
  const { user } = useUserStore();

  const initials = `${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="h-full pt-5 lg:pt-0 md:mx-6 mx-4">
      {/* Avatar + greeting — desktop only */}
      <div className="hidden lg:flex items-center gap-3 px-1 pb-4 mb-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-sm font-medium text-amber-700 flex-shrink-0 select-none">
          {initials || <User size={16} />}
        </div>
        <div className="min-w-0 flex items-center gap-2">
          <p className="text-xs text-gray-400">Xin chào,</p>
          <p className="text-sm font-medium text-amber-700 truncate">
            {user?.lastName}
          </p>
        </div>
      </div>

      <ProfileMenu menuItems={profileSidebarItems} />
    </div>
  );
};

export default ProfileItems;
