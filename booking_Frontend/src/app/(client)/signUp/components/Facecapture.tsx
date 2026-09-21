"use client";
import { useRef, useState, useCallback, useEffect } from "react";

interface FaceCaptureProps {
  onCapture: (descriptor: number[]) => void;
  onClear: () => void;
}

export default function FaceCapture({ onCapture, onClear }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceapiRef = useRef<any>(null);

  const [step, setStep] = useState<
    "idle" | "loading" | "scanning" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setVideoReady(false);
  }, []);

  const startCapture = useCallback(async () => {
    try {
      setStep("loading");
      setMessage("Đang tải mô hình...");

      const faceapi = await import("face-api.js");
      faceapiRef.current = faceapi;

      if (
        !faceapi.nets.ssdMobilenetv1.isLoaded ||
        !faceapi.nets.faceLandmark68Net.isLoaded ||
        !faceapi.nets.faceRecognitionNet.isLoaded
      ) {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
      }

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

      // Gán stream sau khi React render video element xong
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setVideoReady(true);
              setMessage("Nhìn thẳng vào camera rồi nhấn Chụp ảnh");
            });
          };
        }
      }, 150);
    } catch (err: any) {
      setStep("error");
      setMessage(
        err.name === "NotAllowedError"
          ? "Bạn chưa cấp quyền camera. Vui lòng cho phép truy cập camera."
          : err.message || "Không thể mở camera",
      );
    }
  }, []);

  const handleCapture = useCallback(async () => {
    const faceapi = faceapiRef.current;
    const video = videoRef.current;
    if (!faceapi || !video || !videoReady) return;

    setMessage("Đang nhận diện khuôn mặt...");

    try {
      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("⚠️ Không tìm thấy khuôn mặt, hãy nhìn thẳng và thử lại");
        return;
      }

      // Chụp snapshot
      const snap = snapshotRef.current;
      if (snap) {
        snap.width = video.videoWidth || 640;
        snap.height = video.videoHeight || 480;
        const ctx = snap.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          // Corner brackets
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
        }
      }

      stopCamera();
      setStep("done");
      setMessage("Đã lưu khuôn mặt ✓");
      onCapture(Array.from(detection.descriptor));
    } catch {
      setMessage("Lỗi khi nhận diện, thử lại");
    }
  }, [videoReady, stopCamera, onCapture]);

  const handleClear = useCallback(() => {
    stopCamera();
    setStep("idle");
    setMessage("");
    snapshotRef.current = null;
    onClear();
  }, [stopCamera, onClear]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div className="space-y-3">
      {/* Khung hiển thị */}
      <div
        className="relative rounded-xl overflow-hidden w-full bg-slate-900 flex items-center justify-center"
        style={{
          aspectRatio: "4/3",
          border: "2px dashed",
          borderColor:
            step === "done"
              ? "#22c55e"
              : step === "error"
                ? "#ef4444"
                : "rgba(99,102,241,0.4)",
        }}
      >
        {/* IDLE */}
        {step === "idle" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.12)" }}
            >
              <svg
                className="w-8 h-8"
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
            <p className="text-sm text-center" style={{ color: "#64748b" }}>
              Chụp ảnh khuôn mặt
              <br />
              <span style={{ color: "#94a3b8", fontSize: 12 }}>
                (Không bắt buộc)
              </span>
            </p>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div className="flex flex-col items-center gap-3">
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

        {/* VIDEO — luôn render khi scanning để ref không bị null */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          autoPlay
          style={{ display: step === "scanning" ? "block" : "none" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            pointerEvents: "none",
            display: step === "scanning" ? "block" : "none",
          }}
        />

        {/* Oval guide khi scanning */}
        {step === "scanning" && videoReady && (
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

        {/* Spinner chờ video */}
        {step === "scanning" && !videoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
            <div
              className="w-8 h-8 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "#6366f1",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {/* LIVE badge */}
        {step === "scanning" && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs z-20"
            style={{ background: "rgba(0,0,0,0.6)", color: "#9ca3af" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"
              style={{ animation: "pulse 1s infinite" }}
            />
            LIVE
          </div>
        )}

        {/* SNAPSHOT */}
        <canvas
          ref={snapshotRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: step === "done" ? "block" : "none" }}
        />

        {/* ERROR */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-2 py-6 px-4">
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
            <p className="text-sm text-red-400 text-center">{message}</p>
          </div>
        )}
      </div>

      {/* Message */}
      {message && step !== "error" && step !== "idle" && (
        <p
          className="text-xs text-center"
          style={{ color: step === "done" ? "#22c55e" : "#94a3b8" }}
        >
          {message}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {step === "idle" && (
          <button
            type="button"
            onClick={startCapture}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#818cf8",
            }}
          >
            📷 Mở camera
          </button>
        )}

        {step === "scanning" && (
          <>
            <button
              type="button"
              onClick={handleCapture}
              disabled={!videoReady}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              {videoReady ? "📸 Chụp ảnh" : "Đang khởi động..."}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
              }}
            >
              Hủy
            </button>
          </>
        )}

        {(step === "done" || step === "error") && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#818cf8",
            }}
          >
            {step === "done" ? "🔄 Chụp lại" : "🔄 Thử lại"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}
