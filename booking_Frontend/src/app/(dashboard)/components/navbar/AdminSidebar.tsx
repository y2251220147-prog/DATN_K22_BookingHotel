"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  UserPen,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { IListItemAdmin, getMenuByRole } from "./data-admin-Menu";
import { useSidebar } from "../../context/contextAdmin";
import useAuth from "@/lib/authUser";
import { useUserStore } from "@/hook/useUserStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type Role, ROLE_LABEL } from "@/lib/roles";

const AdminSidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { user } = useAuth();

  const { logout, user: userRole } = useUserStore();
  const role = userRole?.role as Role;
  const menu = getMenuByRole(role);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<number[]>(() => {
    // ADMIN và MANAGER có nhiều menu → không auto mở
    if (role === "ADMIN" || role === "MANAGER") {
      // Chỉ mở menu chứa trang hiện tại
      return menu
        .filter((item) =>
          item.subMenuItem?.some((sub) => pathname === sub.link),
        )
        .map((item) => item.id);
    }

    // Các role khác ít menu → mở hết
    return menu.map((item) => item.id);
  });

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  const toggleSubMenu = (id: number) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isMenuActive = (menuItem: IListItemAdmin) =>
    pathname === menuItem.link ||
    menuItem.subMenuItem?.some((sub) => pathname === sub.link);

  const isSubMenuActive = (link: string) => pathname === link;

  const fullName = user?.employee
    ? `${user.firstName} ${user.lastName}`
    : "Admin";
  const position = role ? ROLE_LABEL[role] : "Chức vụ không xác định";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-white border border-gray-200 p-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-white border-r border-gray-100
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          ${isCollapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Header */}
        <div
          className={`border-b border-gray-100 ${isCollapsed ? "py-5 px-2" : "py-5 px-4"}`}
        >
          {isCollapsed ? (
            /* Collapsed: chỉ hiện avatar */
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {initials}
              </div>
            </div>
          ) : (
            /* Expanded: avatar + info + actions */
            <div className="space-y-3">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <Link
                    href="/admin"
                    className="block text-sm font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors"
                  >
                    {fullName}
                  </Link>
                  <span className="inline-block mt-0.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {position}
                  </span>
                </div>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-1 pt-1">
                <Link
                  href="/admin"
                  className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
                <Link
                  href="/admin/profile"
                  className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Hồ sơ"
                >
                  <UserPen className="h-4 w-4" />
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Đăng xuất"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn sẽ đăng xuất khỏi hệ thống và cần đăng nhập lại để
                        tiếp tục.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Đăng xuất
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>

        {/* Nav menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <ul className="space-y-0.5">
            {menu.map((menuItem) => {
              const active = isMenuActive(menuItem);
              return (
                <li key={menuItem.id}>
                  {isCollapsed ? (
                    /* Collapsed item */
                    <div
                      className={`
                        flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl cursor-pointer transition-colors
                        ${active
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }
                      `}
                      onClick={() => {
                        toggleCollapse();
                        toggleSubMenu(menuItem.id);
                      }}
                      title={menuItem.title}
                    >
                      <menuItem.icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium leading-tight text-center truncate w-full px-0.5">
                        {menuItem.title.split(" ")[0]}
                      </span>
                    </div>
                  ) : (
                    /* Expanded item */
                    <>
                      <div
                        className={`
                          flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                          ${active
                            ? "text-blue-600"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          }
                        `}
                        onClick={() => toggleSubMenu(menuItem.id)}
                      >
                        {menuItem.link === "/admin/statiscal" ? (
                          <Link
                            href="/admin/statiscal"
                            className="flex items-center gap-3"
                          >
                            <menuItem.icon className="h-[18px] w-[18px] shrink-0" />
                            <span className="text-sm font-medium">
                              {menuItem.title}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3">
                            <menuItem.icon className="h-[18px] w-[18px] shrink-0" />
                            <span className="text-sm font-medium">
                              {menuItem.title}
                            </span>
                          </div>
                        )}

                        {menuItem.link !== "/admin/statiscal" && (
                          <span
                            className={`transition-transform duration-200 ${expandedMenus.includes(menuItem.id) ? "rotate-0" : "-rotate-90"}`}
                          >
                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </span>
                        )}
                      </div>

                      {/* Submenu */}
                      {expandedMenus.includes(menuItem.id) && (
                        <ul className="mt-1 ml-4 pl-3 border-l border-gray-100 space-y-1">
                          {menuItem.subMenuItem?.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.link}
                                className={`
                                  flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-sm
                                  ${isSubMenuActive(subItem.link)
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                  }
                                `}
                              >
                                <subItem.icon className="h-3.5 w-3.5 shrink-0" />
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle button (desktop only) */}
        <div className="hidden md:flex border-t border-gray-100 p-2">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default AdminSidebar;
