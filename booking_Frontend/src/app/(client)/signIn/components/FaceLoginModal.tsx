"use client";
import React from "react";
import { useFaceLogin } from "@/hook/useFaceLogin";

interface FaceLoginModalProps {
  email: string;
  onSuccess: (data: { accessToken: string; message: string }) => void;
  onClose: () => void;
}

const STATUS_CONFIG = {
  idle: { color: "#6b7280", label: "Chờ nhận diện..." },
  detecting: { color: "#f59e0b", label: "Đang nhận diện..." },
  matched: { color: "#22c55e", label: "Khớp khuôn mặt ✓" },
  failed: { color: "#ef4444", label: "Không khớp, thử lại..." },
};

export default function FaceLoginModal({
  email,
  onSuccess,
  onClose,
}: FaceLoginModalProps) {
  const {
    videoRef,
    canvasRef,
    step,
    faceStatus,
    message,
    startFaceScan,
    reset,
  } = useFaceLogin({ email, onSuccess });

  const statusCfg = STATUS_CONFIG[faceStatus];

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              <svg
                className="w-4 h-4 text-white"
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
            </div>
            <span className="font-semibold text-white text-base">
              Nhận diện khuôn mặt
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.08)", color: "#9ca3af" }}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-5">
          {/* Email tag */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
            style={{
              background: "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <svg
              className="w-3.5 h-3.5"
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
            {email}
          </div>

          {/* State: idle — chưa bắt đầu */}
          {step === "idle" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "2px dashed rgba(99,102,241,0.4)",
                }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: "#818cf8" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <p className="text-center text-sm" style={{ color: "#9ca3af" }}>
                Nhấn bắt đầu để mở camera
                <br />
                và nhận diện khuôn mặt của bạn
              </p>
              <button
                onClick={startFaceScan}
                className="px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                }}
              >
                Bắt đầu quét
              </button>
            </div>
          )}

          {/* State: loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative w-16 h-16">
                <div
                  className="absolute inset-0 rounded-full border-2 border-transparent"
                  style={{
                    borderTopColor: "#6366f1",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full border-2 border-transparent"
                  style={{
                    borderTopColor: "#8b5cf6",
                    animation: "spin 1.2s linear infinite reverse",
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: "#a5b4fc" }}>
                {message}
              </p>
            </div>
          )}

          {/* State: scanning */}
          {step === "scanning" && (
            <>
              {/* Video frame */}
              <div
                className="relative rounded-xl overflow-hidden w-full"
                style={{
                  aspectRatio: "4/3",
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />

                {/* Oval scanning guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="rounded-full"
                    style={{
                      width: "55%",
                      height: "80%",
                      border: `2px solid ${statusCfg.color}`,
                      opacity: 0.6,
                      boxShadow: `0 0 20px ${statusCfg.color}40`,
                      transition: "border-color 0.3s, box-shadow 0.3s",
                    }}
                  />
                </div>

                {/* Corner hint */}
                <div
                  className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#9ca3af" }}
                >
                  LIVE
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 ml-1 align-middle"
                    style={{ animation: "pulse 1s infinite" }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: `${statusCfg.color}15`,
                  border: `1px solid ${statusCfg.color}40`,
                  color: statusCfg.color,
                  transition: "all 0.3s",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: statusCfg.color,
                    animation: "pulse 1.5s infinite",
                  }}
                />
                {message || statusCfg.label}
              </div>
            </>
          )}

          {/* State: success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "2px solid rgba(34,197,94,0.4)",
                }}
              >
                <svg
                  className="w-10 h-10 text-green-400"
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
              </div>
              <p className="font-semibold text-green-400 text-lg">
                Đăng nhập thành công!
              </p>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Đang chuyển hướng...
              </p>
            </div>
          )}

          {/* State: error */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "2px solid rgba(239,68,68,0.3)",
                }}
              >
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-400 text-sm text-center">{message}</p>
              <button
                onClick={() => {
                  reset();
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                }}
              >
                Thử lại
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        `}</style>
      </div>
    </div>
  );
}
