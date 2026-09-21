import { useUserStore } from "@/hook/useUserStore";
import axios from "axios";
import Cookies from "js-cookie";

// ✅ Helper — chỉ chạy ở client
const isClient = typeof window !== "undefined";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 30000,
  withCredentials: true,
});

const axiosRefresh = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 30000,
  withCredentials: true,
});

export const refreshAccessToken = async () => {
  try {
    const response = await axiosRefresh.post(`/api/auth/refresh-token`, {});
    const newAccessToken = response?.data?.accessToken;

    if (!newAccessToken) throw new Error("Không có access token mới");

    // ✅ Chỉ sync localStorage ở client
    if (isClient) {
      localStorage.setItem("token", newAccessToken);
    }

    Cookies.set("token", newAccessToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    const { user, login } = useUserStore.getState();
    if (user) {
      login({ ...user, token: newAccessToken });
    }

    return newAccessToken;
  } catch (error) {
    console.error("Không thể refresh token:", error);
    throw error;
  }
};

// ─── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // ✅ Ưu tiên: Zustand → localStorage (chỉ client) → Cookie
    const token =
      useUserStore.getState().user?.token ??
      (isClient ? localStorage.getItem("token") : null) ??
      Cookies.get("token"); // ✅ Cookie dùng được cả server lẫn client

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  },
);

// ─── Variables for concurrency handling ───
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra từ server!";

    // Mất token / Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang trong quá trình lấy token mới rồi -> Những request đến sau phải chờ (đưa vào hàng đợi)
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest); // Chạy lại request bị tạch ban đầu
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đánh dấu request này là gốc và bắt đầu refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Nhả hàng đợi, gọi tất cả request đang chờ chạy lại
        processQueue(null, newAccessToken);

        // Chạy lại ngay cái request gọi đầu tiên
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu lấy token thất bại -> Báo lỗi cho mớ đang chờ
        processQueue(refreshError, null);
        console.error("Refresh token thất bại:", refreshError);

        // ✅ Chỉ xóa state và redirect ở client
        if (isClient) {
          localStorage.removeItem("token");
          Cookies.remove("token");
          useUserStore.getState().logout(); // Phải dọn cả state Zustand
          window.location.href = "/signIn";
        }
        return Promise.reject(refreshError);
      } finally {
        // Xong xuôi thì nhả cờ refresh
        isRefreshing = false;
      }
    }

    return Promise.reject({ ...error, message });
  },
);

export default axiosInstance;
