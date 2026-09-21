"use client";
import { useUserStore } from "@/hook/useUserStore";
import useAuth from "@/lib/authUser";
import {
  IndentDecrease as ListIndentDecrease,
  IndentIncrease as ListIndentIncrease,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/contextAdmin";
import AdminNotifications from "../AdminNotifications";
import { adminMenu } from "./data-admin-Menu";

const AdminHeader = () => {
  const { user } = useAuth();
  const { logout, user: storedUser } = useUserStore();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();

  const getPageTitle = () => {
    for (const item of adminMenu) {
      // Khớp submenu trước
      const sub = item.subMenuItem?.find((s) => pathname === s.link);
      if (sub) return sub.title;
      // Khớp menu cha
      if (pathname === item.link) return item.title;
    }
    return "Trang Quản Trị";
  };
  return (
    <div className="navbar bg-base-100 shadow-sm mb-5 px-2 md:px-4">
      <div>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors mr-1 md:mr-3"
        >
          {isCollapsed ? (
            <ListIndentIncrease className="h-6 w-6 md:h-7 md:w-7" />
          ) : (
            <ListIndentDecrease className="h-6 w-6 md:h-7 md:w-7 hidden md:block" />
          )}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 md:gap-2.5 truncate">
          <span className="text-xs sm:text-base md:text-lg font-semibold text-gray-800 tracking-wide truncate">
            {getPageTitle()}
          </span>
        </div>
      </div>
      <div className="mx-2 sm:mx-3 md:mx-6 flex-shrink-0">
        <AdminNotifications />
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div className="hidden md:block text-right">
          <p className="text-sm md:text-base font-bold truncate max-w-[120px] lg:max-w-[200px]">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-[11px] md:text-xs text-gray-500 truncate max-w-[120px] lg:max-w-[200px]">{user?.email}</p>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.firstName?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={"/admin/profile"} className="justify-between">
                Thông Tin Tài Khoản
              </Link>
            </li>
            {["ADMIN", "MARKETING", "MANAGER"].includes(
              storedUser?.role || "",
            ) && (
                <li>
                  <Link
                    href={
                      "https://docs.google.com/spreadsheets/d/1IQWsxew9hyFLatyKisGT17s9e-XJvS1LQwEaYmw1Fqg/edit?usp=sharing"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Quản Lý Dữ Liệu
                    <span className="badge bg-red-600 text-white px-2 py-3">
                      New
                    </span>
                  </Link>
                </li>
              )}

            <li>
              <button onClick={logout}>Đăng Xuất</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
