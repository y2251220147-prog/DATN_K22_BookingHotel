"use client";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useUserStore } from "@/hook/useUserStore";
import { DEFAULT_REDIRECT, type Role, ROLE_LABEL } from "@/lib/roles";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const role = user?.role as Role;

  const handleGoHome = () => {
    const home = DEFAULT_REDIRECT[role] ?? "/admin";
    router.push(home);
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-10 max-w-5xl w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-red-500" />
        </div>

        {/* Code */}
        <span className="inline-block text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full mb-4">
          403 Forbidden
        </span>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Không có quyền truy cập
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Tài khoản của bạn chưa được cấp quyền vào trang này. Vui lòng liên hệ
          quản trị viên để được hỗ trợ.
        </p>

        <div className="h-px bg-gray-100 mb-6" />

        {/* Role info */}
        {role && (
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2.5 mb-6">
            Vai trò hiện tại:{" "}
            <span className="font-medium text-gray-600">
              {ROLE_LABEL[role] ?? role}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoHome}
            className=" py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Về trang của tôi
          </button>
          <button
            onClick={() => router.back()}
            className=" py-2.5 text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
