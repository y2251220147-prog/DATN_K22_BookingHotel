/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import dynamic from "next/dynamic";
import axiosInstance from "@/lib/axios";

// Lazy load FaceCapture tránh SSR issue
const FaceCapture = dynamic(() => import("./components/Facecapture"), {
  ssr: false,
});

interface IProvide {
  code: number;
  name: string;
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "omit" }).then((res) => res.json());

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    country: "VietNam",
    idNumber: "",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lưu face descriptor riêng — không trộn vào formData
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

  const { data: dataProvide } = useSWR<IProvide[]>(
    `https://provinces.open-api.vn/api/v2/p`,
    fetcher,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // Chỉ gửi faceDescriptor nếu user đã chụp
        ...(faceDescriptor ? { faceDescriptor } : {}),
      };

      const res = await axiosInstance.post(`/api/auth/signUp`, payload);
      if (res.data) {
        if (formData.email) {
          localStorage.setItem("remembered_email", formData.email);
        }
        toast.success(
          faceDescriptor
            ? "Đăng ký thành công! Khuôn mặt đã được lưu 🎉"
            : "Đăng Ký Thành Công",
        );
        setTimeout(() => {
          router.push("/signIn");
          router.refresh();
        }, 1800);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  useEffect(() => {
    if (mounted) {
      const token = localStorage.getItem("token");
      if (token) router.push("/");
    }
  }, [mounted, router]);

  if (!mounted || (typeof window !== "undefined" && localStorage.getItem("token"))) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-blue-200/50">
        <div className="flex flex-col md:flex-row">
          {/* Left — Image */}
          <div className="md:w-2/5 h-64 md:h-auto relative group">
            <Image
              src="/image/anhsignin.jpg"
              alt="Khách sạn 5 sao"
              width={1000}
              height={1000}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right — Form */}
          <div className="md:w-3/5 p-8 md:p-12 bg-linear-to-br from-white to-blue-50/30">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Đăng Ký Tài Khoản
                </h2>
              </div>
              <p className="text-gray-600 text-base">
                Điền thông tin để bắt đầu trải nghiệm dịch vụ của chúng tôi
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Họ và Tên */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="animate-slide-in-left">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 font-semibold mb-2 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                    Họ
                  </Label>
                  <Input
                    name="firstName"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    placeholder="Nhập họ"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="animate-slide-in-right">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 font-semibold mb-2 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                    Tên
                  </Label>
                  <Input
                    name="lastName"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                    placeholder="Nhập tên"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="animate-fade-in">
                <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
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
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                  placeholder="example@email.com"
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="animate-fade-in">
                <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Số điện thoại
                </Label>
                <Input
                  name="phone"
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                  placeholder="+84 123 456 789"
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="animate-fade-in">
                <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
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
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu 8 ký tự, bao gồm chữ hoa và số
                </p>
              </div>

              {/* Address fields */}
              {formData.country === "VietNam" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="animate-slide-in-right w-full">
                      <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Quốc gia
                      </Label>
                      <Select
                        value={formData.country}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, country: val }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn quốc tịch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VietNam">Việt Nam</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="animate-slide-in-left">
                      <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, city: val }))
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300">
                          <SelectValue placeholder="Chọn thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataProvide?.map((item) => (
                            <SelectItem key={item.code} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="animate-fade-in">
                    <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Địa chỉ
                    </Label>
                    <Input
                      name="address"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                      placeholder="Số nhà, đường, phường/xã"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="animate-fade-in">
                    <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      Số CMND/CCCD
                    </Label>
                    <Input
                      name="idNumber"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                      placeholder="Số chứng minh nhân dân/căn cước"
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="animate-slide-in-right w-full">
                    <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      Quốc gia
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, country: val }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn quốc tịch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VietNam">Việt Nam</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="animate-fade-in">
                    <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      Passport number
                    </Label>
                    <Input
                      name="idNumber"
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                      placeholder="Passport Number"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* ── FACE CAPTURE ── */}
              {/* <div className="animate-fade-in">
                <Label className="text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Nhận diện khuôn mặt
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    (tuỳ chọn — dùng để đăng nhập nhanh)
                  </span>
                </Label>
                <FaceCapture
                  onCapture={(descriptor) => setFaceDescriptor(descriptor)}
                  onClear={() => setFaceDescriptor(null)}
                />

                {faceDescriptor && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Khuôn mặt đã được ghi nhận — bạn có thể đăng nhập bằng khuôn
                    mặt sau này
                  </div>
                )}
              </div> */}

              {/* Submit */}
              <Button
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 mt-6 animate-bounce-in"
                type="submit"
              >
                <span className="flex items-center justify-center gap-2">
                  Đăng Ký Ngay
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Button>

              <div className="text-center text-gray-600 animate-fade-in pt-4">
                Đã có tài khoản?{" "}
                <Link
                  href="/signIn"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Đăng nhập tại đây
                </Link>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
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
                  Bảo mật thông tin
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Xác thực email
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đăng ký nhanh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
