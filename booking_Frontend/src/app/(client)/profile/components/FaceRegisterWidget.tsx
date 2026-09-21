"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { loadFaceApi } from "@/lib/faceapi-loader";

interface FaceRegisterWidgetProps {
  isUpdate: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export default function FaceRegisterWidget({
  isUpdate,
  onSuccess,
  onClose,
}: FaceRegisterWidgetProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceapiRef = useRef<any>(null);

  const [step, setStep] = useState<
    "idle" | "loading" | "scanning" | "confirm" | "saving" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string>("");
  const [pendingDescriptor, setPendingDescriptor] = useState<number[] | null>(
    null,
  );

  // ─────────────────────────────────────────────
  // Camera helpers
  // ─────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setVideoReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setStep("loading");
      setMessage("Đang tải mô hình nhận diện...");

      // 🔥 FIX 1: Dùng shared cache — lần 2+ gần như instant
      faceapiRef.current = await loadFaceApi();

      setMessage("Đang mở camera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      streamRef.current = stream;

      setStep("scanning");
      setMessage("Nhìn thẳng vào camera rồi nhấn Chụp");

      setTimeout(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().then(() => setVideoReady(true));
        };
      }, 100);
    } catch (err: any) {
      setStep("error");
      setMessage(
        err.name === "NotAllowedError"
          ? "Bạn chưa cấp quyền camera"
          : err.message || "Không thể mở camera",
      );
    }
  }, []);

  // ─────────────────────────────────────────────
  // Capture
  // ─────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const video = videoRef.current;
    if (!faceapi || !video || !videoReady) return;

    setMessage("Đang nhận diện khuôn mặt...");

    const detection = await faceapi
      .detectSingleFace(
        video,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessage("⚠️ Không tìm thấy khuôn mặt, nhìn thẳng và thử lại");
      return;
    }

    // ✅ FIX 2: Luôn tạo canvas mới — không check snapshotUrl cũ
    const snap = document.createElement("canvas");
    snap.width = video.videoWidth || 640;
    snap.height = video.videoHeight || 480;
    const ctx = snap.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0);

      // Vẽ corner brackets
      const { x, y, width, height } = detection.detection.box;
      const len = Math.min(width, height) * 0.2;
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      const corners: [number, number, number, number][] = [
        [x, y, 1, 1],
        [x + width, y, -1, 1],
        [x, y + height, 1, -1],
        [x + width, y + height, -1, -1],
      ];
      corners.forEach(([bx, by, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(bx, by + dy * len);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + dx * len, by);
        ctx.stroke();
      });

      setSnapshotUrl(snap.toDataURL("image/jpeg"));
    }

    stopCamera();
    setPendingDescriptor(Array.from(detection.descriptor));
    setStep("confirm");
    setMessage("Khuôn mặt đã được nhận diện. Xác nhận để lưu?");
  }, [videoReady, stopCamera]);

  // ─────────────────────────────────────────────
  // Confirm save
  // ─────────────────────────────────────────────
  const handleConfirm = useCallback(async () => {
    if (!pendingDescriptor) return;

    try {
      setStep("saving");
      setMessage("Đang lưu khuôn mặt...");

      // ✅ FIX 3: Axios tự throw nếu status >= 400
      // Không cần check !res.data (luôn truthy nếu không throw)
      await axiosInstance.put(`/api/auth/face-descriptor`, {
        descriptor: pendingDescriptor,
      });

      setStep("done");
      setMessage("Khuôn mặt đã được lưu thành công!");
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setStep("error");
      setMessage(
        err.response?.data?.message || err.message || "Lưu thất bại, thử lại",
      );
    }
  }, [pendingDescriptor, onSuccess]);

  // ─────────────────────────────────────────────
  // Retake / Reset
  // ─────────────────────────────────────────────
  const handleRetake = useCallback(() => {
    setPendingDescriptor(null);
    setSnapshotUrl("");
    setStep("idle");
    setMessage("");
  }, []);

  // Cleanup khi unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
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
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <span className="text-sm">👤</span>
            </div>
            <span className="font-semibold text-white">
              {isUpdate ? "Cập nhật khuôn mặt" : "Đăng ký khuôn mặt"}
            </span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
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
          {/* ── Step: idle ── */}
          {step === "idle" && (
            <div className="flex flex-col items-center gap-4 py-4 w-full">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
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

              {isUpdate && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    color: "#fbbf24",
                  }}
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Khuôn mặt cũ sẽ bị thay thế hoàn toàn
                </div>
              )}

              <p className="text-center text-sm" style={{ color: "#94a3b8" }}>
                Hãy đảm bảo khuôn mặt bạn được chiếu sáng tốt
                <br />
                và nhìn thẳng vào camera
              </p>

              <button
                onClick={startCamera}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                }}
              >
                📷 Mở camera
              </button>
            </div>
          )}

          {/* ── Step: loading ── */}
          {step === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="relative w-14 h-14">
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

          {/* ── Video (luôn render khi scanning) ── */}
          <div
            className="relative rounded-xl overflow-hidden w-full"
            style={{
              aspectRatio: "4/3",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.06)",
              display: step === "scanning" ? "block" : "none",
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
            />

            {videoReady && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="rounded-full"
                  style={{
                    width: "55%",
                    height: "80%",
                    border: "2px dashed rgba(99,102,241,0.6)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            )}

            {!videoReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <div
                  className="w-8 h-8 rounded-full border-2 border-transparent"
                  style={{
                    borderTopColor: "#6366f1",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}

            <div
              className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs z-10"
              style={{ background: "rgba(0,0,0,0.6)", color: "#9ca3af" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-red-500"
                style={{ animation: "pulse 1s infinite" }}
              />
              LIVE
            </div>
          </div>

          {/* ── Buttons khi scanning ── */}
          {step === "scanning" && (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCapture}
                disabled={!videoReady}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                }}
              >
                {videoReady ? "📸 Chụp ảnh" : "Đang khởi động..."}
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setStep("idle");
                }}
                className="px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                Hủy
              </button>
            </div>
          )}

          {step === "scanning" && message && (
            <p className="text-xs text-center" style={{ color: "#94a3b8" }}>
              {message}
            </p>
          )}

          {/* ── Step: confirm ── */}
          {step === "confirm" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div
                className="relative rounded-xl overflow-hidden w-full"
                style={{ aspectRatio: "4/3" }}
              >
                {snapshotUrl && (
                  <Image
                    src={snapshotUrl}
                    className="w-full h-full object-cover"
                    alt="snapshot"
                    width={640}
                    height={480}
                  />
                )}
                <div
                  className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                  style={{
                    background: "rgba(34,197,94,0.2)",
                    border: "1px solid rgba(34,197,94,0.4)",
                    color: "#4ade80",
                  }}
                >
                  ✓ Khuôn mặt hợp lệ
                </div>
              </div>

              <p className="text-sm text-center" style={{ color: "#94a3b8" }}>
                Xác nhận lưu khuôn mặt này để đăng nhập?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }}
                >
                  🔄 Chụp lại
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  }}
                >
                  ✓ Xác nhận lưu
                </button>
              </div>
            </div>
          )}

          {/* ── Step: saving ── */}
          {step === "saving" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-10 h-10 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: "#6366f1",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p className="text-sm" style={{ color: "#a5b4fc" }}>
                {message}
              </p>
            </div>
          )}

          {/* ── Step: done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "2px solid rgba(34,197,94,0.4)",
                }}
              >
                <svg
                  className="w-8 h-8 text-green-400"
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
              <p className="font-semibold text-green-400">{message}</p>
            </div>
          )}

          {/* ── Step: error ── */}
          {step === "error" && (
            <div className="flex flex-col items-center gap-4 py-4 w-full">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "2px solid rgba(239,68,68,0.3)",
                }}
              >
                <svg
                  className="w-8 h-8 text-red-400"
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
                onClick={handleRetake}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818cf8",
                }}
              >
                Thử lại
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        `}</style>
      </div>
    </div>
  );
}
