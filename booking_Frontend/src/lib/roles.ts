export type Role =
  | "ADMIN"
  | "MANAGER"
  | "FRONT_DESK"
  | "MAINTENANCE"
  | "MARKETING";

export const DEFAULT_REDIRECT: Record<Role, string> = {
  ADMIN: "/admin",
  MANAGER: "/admin",
  FRONT_DESK: "/admin/bookings/listbooking",
  MAINTENANCE: "/admin/rooms/maintenance",
  MARKETING: "/admin/blog",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Quản lý",
  FRONT_DESK: "Lễ tân",
  MAINTENANCE: "Bảo trì",
  MARKETING: "Marketing",
};
