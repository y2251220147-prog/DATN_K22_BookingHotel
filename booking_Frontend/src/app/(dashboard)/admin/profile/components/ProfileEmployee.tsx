"use client";

import { useRouter } from "next/navigation";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { UserProfile, UserStatus } from "./employee";
import { formatDate } from "@/lib/formatDate";
import { translateDepartment, translatePosition } from "@/lib/translate";
import { useEffect, useState } from "react";
import FaceRegisterWidget from "@/app/(client)/profile/components/FaceRegisterWidget";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { useUserStore } from "@/hook/useUserStore";
import { ROLE_LABEL } from "@/lib/roles";

// Format date function with proper typing

interface StatusInfo {
  text: string;
  color: string;
}

interface EmployeeProfileProps {
  profile: UserProfile;
}

export default function EmployeeProfile({ profile }: EmployeeProfileProps) {
  const router = useRouter();
  const [hasFace, setHasFace] = useState<boolean | null>(null);
  const [faceLoading, setFaceLoading] = useState(true);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const { user } = useUserStore();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Lấy trạng thái khuôn mặt
  useEffect(() => {
    if (!token) return;
    axiosInstance
      .get(`/api/auth/face-descriptor/status`)
      .then((r) => r.data)
      .then((d) => setHasFace(d.hasFace))
      .catch(() => setHasFace(false))
      .finally(() => setFaceLoading(false));
  }, [token]);

  const handleDeleteFace = async () => {
    if (!confirm("Bạn có chắc muốn xóa khuôn mặt đã đăng ký?")) return;

    try {
      const res = await axiosInstance.delete(`/api/auth/face-descriptor`);

      if (res.status === 200) {
        setHasFace(false);
        toast.success("Đã xóa khuôn mặt");
      }
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };
  // Format status with proper typing
  const formatStatus = (status: UserStatus): StatusInfo => {
    const statuses: Record<UserStatus, StatusInfo> = {
      ACTIVE: { text: "Hoạt động", color: "bg-green-100 text-green-800" },
      INACTIVE: {
        text: "Không hoạt động",
        color: "bg-red-100 text-red-800",
      },
      SUSPENDED: { text: "Tạm ngưng", color: "bg-yellow-100 text-yellow-800" },
    };
    return (
      statuses[status] || { text: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  // Calculate work duration in months
  const calculateWorkDuration = (
    hireDate: string | null | undefined,
  ): number => {
    if (!hireDate) return 0;
    const start = new Date(hireDate);
    const now = new Date();
    return Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Không tìm thấy thông tin hồ sơ
          </p>
        </div>
      </div>
    );
  }

  const statusInfo = formatStatus(profile.status);

  return (
    <div className="min-h-screen  py-8">
      <div className=" mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="relative h-40 bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}
              >
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-20 mb-4">
              <div className="w-36 h-36 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <UserCircleIcon className="w-32 h-32 text-gray-400" />
              </div>
            </div>

            {/* Name and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/profile/change-password")}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  type="button"
                >
                  <KeyIcon className="w-5 h-5" />
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <UserCircleIcon className="w-6 h-6 text-blue-600" />
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-medium text-gray-800 break-all">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <PhoneIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        Số điện thoại
                      </p>
                      <p className="font-medium text-gray-800">
                        {profile.phone || (
                          <span className="text-gray-400 italic">
                            Chưa cập nhật
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* User Type */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        Loại tài khoản
                      </p>
                      <p className="font-medium text-gray-800">
                        {profile.userType === "EMPLOYEE"
                          ? "Nhân viên"
                          : profile.userType}
                      </p>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <CalendarIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        Ngày tạo tài khoản
                      </p>
                      <p className="font-medium text-gray-800">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Information */}
              {profile.employee && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                    Thông tin công việc
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Phòng ban</p>
                        <p className="font-medium text-gray-800">
                          {translateDepartment(profile.employee.department)}
                        </p>
                      </div>
                    </div>

                    {/* Position */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <BriefcaseIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Chức vụ</p>
                        <p className="font-medium text-gray-800">
                          {ROLE_LABEL[user?.role as keyof typeof ROLE_LABEL] ??
                            "Chức vụ không xác định"}
                        </p>
                      </div>
                    </div>

                    {/* Hire Date */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 md:col-span-2">
                      <CalendarIcon className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Ngày bắt đầu làm việc
                        </p>
                        <p className="font-medium text-gray-800">
                          {formatDate(profile.employee.hireDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 space-y-8">
              {/* ── FACE SECTION ── */}
              <div
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl bg-white shadow-sm border border-gray-100">
                  👤
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-gray-800">
                      Nhận diện khuôn mặt
                    </span>
                    {faceLoading ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                        Đang kiểm tra...
                      </span>
                    ) : hasFace ? (
                      <span
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "#dcfce7",
                          color: "#16a34a",
                          border: "1px solid #bbf7d0",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Đã đăng ký
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "#f3f4f6",
                          color: "#6b7280",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                        Chưa đăng ký
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Đăng nhập nhanh không cần mật khẩu bằng khuôn mặt của bạn
                  </p>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {faceLoading ? null : hasFace ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFaceModal(true)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{
                          background: "#fef3c7",
                          color: "#d97706",
                          border: "1px solid #fde68a",
                        }}
                      >
                        Cập nhật
                      </button>
                      <button
                        onClick={handleDeleteFace}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFaceModal(true)}
                      className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:scale-105 hover:shadow-md bg-blue-600"
                    >
                      Đăng ký ngay
                    </button>
                  )}
                </div>
              </div>

              {/* ── DIVIDER ── */}
            </div>

            {/* Notice */}
            <div className="mt-8 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex gap-3">
                <svg
                  className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Lưu ý quan trọng
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Bạn chỉ có thể tự cập nhật <strong>Họ, Tên</strong> và{" "}
                    <strong>Số điện thoại</strong>. Để thay đổi{" "}
                    <strong>Phòng ban, Chức vụ</strong> hoặc các thông tin công
                    việc khác, vui lòng liên hệ với bộ phận quản trị.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Thời gian làm việc</p>
            <p className="text-2xl font-bold text-gray-800">
              {calculateWorkDuration(profile.employee?.hireDate)} tháng
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
            <p className="text-2xl font-bold text-gray-800">
              {statusInfo.text}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Phòng ban</p>
            <p className="text-lg font-bold text-gray-800">
              {translateDepartment(profile.employee?.department)}
            </p>
          </div>
        </div>
      </div>

      {showFaceModal && token && (
        <FaceRegisterWidget
          isUpdate={!!hasFace}
          onSuccess={() => {
            setHasFace(true);
            setShowFaceModal(false);
            toast.success(
              hasFace
                ? "Cập nhật khuôn mặt thành công!"
                : "Đăng ký khuôn mặt thành công! 🎉",
            );
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </div>
  );
}
