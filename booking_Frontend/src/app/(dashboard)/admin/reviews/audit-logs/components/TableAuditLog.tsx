import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  BedDouble,
  LogIn,
  LogOut,
  CreditCard,
  XCircle,
  Activity,
} from "lucide-react";

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  userType?: "Customer" | "Employee" | "System" | null;
  details?: string | null;
  createdAt: Date;
  lastName: string;
  firstName: string;
}

interface IAuditLogProps {
  auditLogs: AuditLog[];
}

type ActionConfig = {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  label: string;
};

const ACTION_CONFIG: Record<string, ActionConfig> = {
  CREATE_BOOKING: {
    icon: BedDouble,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    label: "Đặt phòng mới",
  },
  CANCEL_BOOKING: {
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    label: "Huỷ đặt phòng",
  },
  CHECK_IN: {
    icon: LogIn,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    label: "Nhận phòng",
  },
  CHECK_OUT: {
    icon: LogOut,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    label: "Trả phòng",
  },
  PAYMENT_SUCCESS: {
    icon: CreditCard,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    label: "Thanh toán thành công",
  },
  PAYMENT_CANCEL: {
    icon: XCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    label: "Thanh toán đã hủy",
  },
};

const getActionConfig = (action: string): ActionConfig =>
  ACTION_CONFIG[action] ?? {
    icon: Activity,
    iconColor: "text-gray-500",
    bgColor: "bg-gray-100",
    label: action,
  };

const TableAuditLog = ({ auditLogs }: IAuditLogProps) => {
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center text-gray-400 text-sm">
        Hôm nay chưa có hoạt động nào
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl divide-y divide-gray-100">
      {auditLogs.map((log) => {
        const {
          icon: Icon,
          iconColor,
          bgColor,
          label,
        } = getActionConfig(log.action);

        return (
          <div
            key={log.id}
            className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bgColor}`}
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              {log.details && (
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                  {log.details}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(log.createdAt), "HH:mm - dd/MM/yyyy", {
                  locale: vi,
                })}
              </p>
            </div>

            {/* User type badge */}
            {log.userType && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 flex-shrink-0 self-start mt-0.5">
                {log.userType === "Customer"
                  ? "Khách"
                  : log.userType === "Employee"
                    ? "Nhân viên"
                    : "Hệ thống"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableAuditLog;
