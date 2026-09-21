"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";

const ResetPasswordForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    if (!token) {
      setError("Token không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/reset-password", {
        token,
        password,
      });

      if (response.data.message === "Password updated") {
        setSuccess(true);
      } else {
        setError(response.data.error || "Đặt lại mật khẩu thất bại");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Đặt lại mật khẩu thành công
        </h2>
        <p className="text-center mb-6">
          Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể đăng nhập bằng
          mật khẩu mới.
        </p>
        <button
          onClick={() => router.push("/signIn")}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Đến trang đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">
        Đặt lại mật khẩu mới
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập mật khẩu mới"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập lại mật khẩu mới"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
