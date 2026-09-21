// src/app/(auth)/signIn/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { URL_API } from "@/lib/fetcher";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useUserStore } from "@/hook/useUserStore";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Eye } from "lucide-react";
import { useCheckFaceLog } from "@/hook/useCheckFaceLog";
import axiosInstance from "@/lib/axios";

const FaceLoginModal = dynamic(() => import("./components/FaceLoginModal"), {
  ssr: false,
});

export default function SignInForm() {
  const { login } = useUserStore();
  const {
    hasFace,
    checked,
    loading: faceLoading,
    checkFace,
  } = useCheckFaceLog();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [message, setMessage] = useState("");
  const [showFaceModal, setShowFaceModal] = useState(false);
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Check face khi email thay đổi
  useEffect(() => {
    if (!formData.email || !formData.email.includes("@")) return;
    const timer = setTimeout(() => checkFace(formData.email), 500);
    return () => clearTimeout(timer);
  }, [formData.email]);

  // Auto open modal khi check xong có face
  useEffect(() => {
    if (checked && hasFace) setShowFaceModal(true);
  }, [checked, hasFace]);

  // Redirect nếu đã login
  useEffect(() => {
    if (token) {
      redirectAfterLogin(token);
    }
  }, [token]);

  const redirectAfterLogin = React.useCallback(
    (token: string) => {
      const decoded: any = jwtDecode(token);
      if (
        decoded.userType === "EMPLOYEE" ||
        decoded.userType === "ADMIN" ||
        decoded.role
      ) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
    [router],
  );

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      localStorage.setItem("remembered_email", value);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`/api/auth/login`, formData);
      if (res.data?.accessToken) {
        handleLoginSuccess(res.data.accessToken);
        redirectAfterLogin(res.data.accessToken);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Đăng nhập không thành công");
    }
  };

  const handleLoginSuccess = (token: string) => {
    const decoded: any = jwtDecode(token);
    login({
      id: decoded.id,
      lastName: decoded.lastName,
      userType: decoded.userType,
      token,
      role: decoded.role,
    });
  };

  const handleFaceSuccess = (data: { accessToken: string }) => {
    handleLoginSuccess(data.accessToken);
    redirectAfterLogin(data.accessToken);
    if (formData.email) {
      localStorage.setItem("remembered_email", formData.email);
    }

    setShowFaceModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-blue-200/50 flex flex-col md:flex-row">
        {/* Left — Image */}
        <div className="md:w-1/2 h-64 md:h-auto relative group">
          <Image
            src="/image/khach-san-14.jpg"
            alt="Khách sạn 5 sao"
            width={1000}
            height={1000}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right — Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-linear-to-br from-white to-blue-50/30">
          {/* Header */}
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Đăng Nhập
              </h3>
            </div>
            <p className="text-gray-600 text-lg">
              Chào mừng bạn quay trở lại với chúng tôi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="animate-slide-in-left">
              <Label
                htmlFor="email"
                className="text-base text-gray-700 font-semibold mb-2 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email
                {/* Loading indicator khi đang check face */}
                {faceLoading && (
                  <span className="text-xs text-blue-400 font-normal">
                    đang kiểm tra...
                  </span>
                )}
              </Label>
              <Input
                name="email"
                type="email"
                className="w-full px-5 py-3.5 text-base border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 bg-white"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="animate-slide-in-right">
              <Label
                htmlFor="password"
                className="text-base text-gray-700 font-semibold mb-2 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Mật Khẩu
              </Label>
              <Input
                name="password"
                type="password"
                className="w-full px-5 py-3.5 text-base border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300 bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={handleCheckboxChange}
                  className="h-5 w-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-base text-gray-600 cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-base text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <Button
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 animate-bounce-in mt-2"
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                Đăng Nhập
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Button>
          </form>

          {/* Error */}
          {message && (
            <div className="flex items-center gap-2 p-4 mt-4 bg-red-50 border border-red-200 rounded-xl text-red-600 animate-fade-in">
              <svg
                className="w-5 h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {/* Sign up */}
          <div className="text-center text-base text-gray-600 animate-fade-in mt-8">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="/signUp"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-6 animate-fade-in">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-base font-medium">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          {/* Social + Face buttons */}
          <div className="flex gap-3 animate-fade-in">
            {/* Google */}
            <Button
              variant="outline"
              className="flex-1 gap-2 py-4 text-base border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all group"
              onClick={() => router.push(`${URL_API}/api/auth/google`)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="group-hover:text-gray-700 transition-colors">
                Google
              </span>
            </Button>

            {/* Face Login Button */}
            <Button
              variant="outline"
              onClick={() => {
                if (!formData.email.trim()) {
                  setMessage(
                    "Vui lòng nhập email trước khi dùng nhận diện khuôn mặt",
                  );
                  return;
                }
                setShowFaceModal(true);
              }}
              className="flex-1 gap-2 py-4 text-base border-2 transition-all group hover:scale-[1.02]"
            >
              <Eye size={20} />
              <span>Khuôn mặt</span>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Bảo mật SSL
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Hỗ trợ 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Face Login Modal */}
      {showFaceModal && formData.email && (
        <FaceLoginModal
          email={formData.email}
          onSuccess={handleFaceSuccess}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </div>
  );
}
