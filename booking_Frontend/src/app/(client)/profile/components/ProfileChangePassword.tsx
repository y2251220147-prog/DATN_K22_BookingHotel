/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axiosInstance from "@/lib/axios";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { URL_API } from "@/lib/fetcher";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  ScanFace,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

const FaceRegisterWidget = dynamic(() => import("./FaceRegisterWidget"), {
  ssr: false,
});

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordRules = [
  { label: "Ít nhất 6 ký tự", test: (p: string) => p.length >= 6 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có chữ số", test: (p: string) => /[0-9]/.test(p) },
];

function getStrength(password: string): number {
  return passwordRules.filter((r) => r.test(password)).length;
}

const strengthConfig = [
  { label: "", color: "bg-gray-200" },
  { label: "Yếu", color: "bg-red-400" },
  { label: "Trung bình", color: "bg-yellow-400" },
  { label: "Mạnh", color: "bg-green-500" },
];

const ProfileChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Face state
  const [hasFace, setHasFace] = useState<boolean | null>(null);
  const [faceLoading, setFaceLoading] = useState(true);
  const [showFaceModal, setShowFaceModal] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
      if (res.data) {
        setHasFace(false);
        toast.success("Đã xóa khuôn mặt");
      }
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShow = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/api/auth/user/changePassword`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { withCredentials: true },
      );
      if (res.data) {
        toast.success("Thay đổi mật khẩu thành công!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(formData.newPassword);
  const confirmMatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword === formData.confirmPassword;
  const confirmMismatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword !== formData.confirmPassword;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl bg-linear-to-r from-amber-500 to-orange-500 px-8 py-7">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Đổi Mật Khẩu</h2>
            <p className="text-amber-100 text-sm mt-0.5">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 p-8 space-y-7">
        {/* ── FACE SECTION ── */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
            <ScanFace className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 text-sm">
                Nhận diện khuôn mặt
              </span>
              {faceLoading ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  <Loader2 className="w-3 h-3 animate-spin" /> Đang kiểm tra...
                </span>
              ) : hasFace ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Đã đăng ký
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Chưa đăng ký
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Đăng nhập nhanh không cần mật khẩu
            </p>
          </div>

          <div className="flex-shrink-0">
            {!faceLoading &&
              (hasFace ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFaceModal(true)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={handleDeleteFace}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowFaceModal(true)}
                  className="text-xs font-semibold px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                >
                  Đăng ký
                </button>
              ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            Đổi mật khẩu
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── PASSWORD FORM ── */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={show.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-gray-50 hover:bg-white hover:border-gray-300"
                required
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {show.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={show.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-gray-50 hover:bg-white hover:border-gray-300"
                required
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {show.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {formData.newPassword.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength
                            ? strengthConfig[strength].color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <span
                      className={`text-xs font-medium ${
                        strength === 3
                          ? "text-green-500"
                          : strength === 2
                            ? "text-yellow-500"
                            : "text-red-400"
                      }`}
                    >
                      {strengthConfig[strength].label}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(formData.newPassword);
                    return (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-1 text-xs transition-colors ${passed ? "text-green-500" : "text-gray-400"}`}
                      >
                        {passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={show.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 hover:bg-white ${
                  confirmMatch
                    ? "border-green-300 focus:ring-green-300 focus:border-green-400"
                    : confirmMismatch
                      ? "border-red-300 focus:ring-red-300 focus:border-red-400"
                      : "border-gray-200 focus:ring-amber-400 focus:border-amber-400 hover:border-gray-300"
                }`}
                required
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {show.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmMatch && (
              <p className="mt-1.5 text-xs text-green-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mật khẩu khớp
              </p>
            )}
            {confirmMismatch && (
              <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Mật khẩu chưa khớp
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              loading
                ? "bg-amber-300 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-md active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Đổi Mật Khẩu
              </>
            )}
          </button>
        </form>
      </div>

      {/* Face Register Modal */}
      {showFaceModal && token && (
        <FaceRegisterWidget
          isUpdate={!!hasFace}
          onSuccess={() => {
            setHasFace(true);
            setShowFaceModal(false);
            toast.success(
              hasFace
                ? "Cập nhật khuôn mặt thành công!"
                : "Đăng ký khuôn mặt thành công!",
            );
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileChangePassword;
