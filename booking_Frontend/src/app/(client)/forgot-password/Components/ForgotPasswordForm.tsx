"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { URL_API } from "@/lib/fetcher";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [thanhCong, setThanhCong] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDangGui(true);
    setLoi("");

    try {
      // Thay bằng API endpoint thực tế của bạn
      const res = await axios.post(`${URL_API}/api/auth/forgot-password`, {
        email,
      });

      if (res.data) {
        setThanhCong(true);
      } else {
        setLoi(res.data.thongBao || "Gửi liên kết đặt lại mật khẩu thất bại");
        toast.error("Gửi liên kết đặt lại mật khẩu thất bại");
      }
    } catch (err: any) {
      setLoi(
        err.response?.data?.thongBao || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setDangGui(false);
    }
  };

  if (thanhCong) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
        <h2 className="text-2xl font-bold text-center mb-4">Đã Gửi Liên Kết</h2>
        <p className="text-center mb-6">
          Chúng tôi đã gửi liên kết đặt lại mật khẩu đến địa chỉ email của bạn.
          Vui lòng kiểm tra hộp thư.
        </p>
        <button
          onClick={() => router.push("/signIn")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-16">
      <h2 className="text-2xl font-bold text-center mb-6">Đặt Lại Mật Khẩu</h2>
      <p className="text-center mb-6">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật
        khẩu.
      </p>

      {loi && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {loi}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Địa chỉ Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập email đăng ký tài khoản khách sạn"
            required
          />
        </div>

        <button
          type="submit"
          disabled={dangGui}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {dangGui ? "Đang gửi..." : "Gửi Liên Kết Đặt Lại"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/signIn")}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Nhớ mật khẩu? Đăng nhập tại đây
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
