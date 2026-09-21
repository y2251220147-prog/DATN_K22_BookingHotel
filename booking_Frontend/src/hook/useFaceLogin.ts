"use client";
import axiosInstance from "@/lib/axios";
import { loadFaceApi } from "@/lib/faceapi-loader";
import { useState, useRef, useCallback, useEffect } from "react";

const THRESHOLD = 0.5;
const SCAN_INTERVAL = 300;
const MAX_FAIL = 5;

export type FaceLoginStep =
  | "idle"
  | "loading"
  | "scanning"
  | "success"
  | "error";
export type FaceStatus = "idle" | "detecting" | "matched" | "failed";

interface UseFaceLoginProps {
  email: string;
  onSuccess: (data: { accessToken: string; message: string }) => void;
}

export function useFaceLogin({ email, onSuccess }: UseFaceLoginProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ⚡ FIX 3: dùng setTimeout thay setInterval → tránh overlap
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScanningRef = useRef(false); // flag để dừng loop

  const streamRef = useRef<MediaStream | null>(null);
  const faceapiRef = useRef<any>(null);
  const referenceDescriptorRef = useRef<Float32Array | null>(null);
  const failCountRef = useRef(0);

  const [step, setStep] = useState<FaceLoginStep>("idle");
  const [faceStatus, setFaceStatus] = useState<FaceStatus>("idle");
  const [message, setMessage] = useState("");

  const stopCamera = useCallback(() => {
    isScanningRef.current = false; // ← dừng detect loop
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stopCamera();
    failCountRef.current = 0;
    setStep("idle");
    setFaceStatus("idle");
    setMessage("");
  }, [stopCamera]);

  const drawBox = useCallback((detection: any, color: string) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const faceapi = faceapiRef.current;
    if (!canvas || !video || !faceapi) return;

    const dims = faceapi.matchDimensions(canvas, video, true);
    const resized = faceapi.resizeResults(detection, dims);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { x, y, width, height } = resized.detection.box;
    const len = 20;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Vẽ 4 góc
    ctx.beginPath();
    ctx.moveTo(x, y + len);
    ctx.lineTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - len, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + len);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + height - len);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + len, y + height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - len, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - len);
    ctx.stroke();

    faceapi.draw.drawFaceLandmarks(canvas, resized);
  }, []);

  const startDetection = useCallback(() => {
    const faceapi = faceapiRef.current;
    const referenceDescriptor = referenceDescriptorRef.current;
    if (!faceapi || !referenceDescriptor) return;

    isScanningRef.current = true;

    const detect = async () => {
      // Kiểm tra flag trước mỗi lần chạy
      if (!isScanningRef.current) return;

      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const detection = await faceapi
          .detectSingleFace(
            video,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.7 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        // Kiểm tra lại sau async — tránh race condition
        if (!isScanningRef.current) return;

        if (!detection) {
          setFaceStatus("idle");
          setMessage("Đưa khuôn mặt vào khung hình...");
          canvasRef.current
            ?.getContext("2d")
            ?.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
        } else {
          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            referenceDescriptor,
          );

          if (distance < THRESHOLD) {
            // ── Matched ──────────────────────────────
            failCountRef.current = 0;
            isScanningRef.current = false; // dừng loop ngay
            drawBox(detection, "#22c55e");
            setFaceStatus("matched");
            setMessage("Đang xác thực...");

            try {
              const loginRes = await axiosInstance.post(
                `/api/auth/login/face`,
                {
                  email,
                  descriptor: Array.from(detection.descriptor),
                },
              );
              const loginData = loginRes.data;

              if (loginData) {
                stopCamera();
                setStep("success");
                setMessage("Đăng nhập thành công!");
                onSuccess(loginData);
              } else {
                setFaceStatus("failed");
                setMessage(loginData.message || "Xác thực thất bại");
                // Cho scan lại sau 2s
                setTimeout(() => {
                  if (!isScanningRef.current) {
                    setFaceStatus("idle");
                    setMessage("Đưa khuôn mặt vào khung hình...");
                    isScanningRef.current = true;
                    timeoutRef.current = setTimeout(detect, SCAN_INTERVAL);
                  }
                }, 2000);
                return; // không schedule lại ở cuối
              }
            } catch (err: any) {
              setFaceStatus("failed");
              setMessage(err.message || "Lỗi xác thực");
            }
            return; // đã dừng loop
          } else {
            // ── Not matched ──────────────────────────
            failCountRef.current += 1;
            const remaining = MAX_FAIL - failCountRef.current;

            if (failCountRef.current >= MAX_FAIL) {
              isScanningRef.current = false;
              drawBox(detection, "#ef4444");
              setFaceStatus("failed");
              setStep("error");
              setMessage(
                "Không nhận ra khuôn mặt. Vui lòng thử lại hoặc đăng nhập bằng mật khẩu.",
              );
              return; // dừng hẳn
            } else {
              drawBox(detection, "#ef4444");
              setFaceStatus("detecting");
              setMessage(`Khuôn mặt chưa khớp — còn ${remaining} lần thử`);
            }
          }
        }
      }

      // Schedule lần tiếp SAU KHI xử lý xong (không overlap)
      if (isScanningRef.current) {
        timeoutRef.current = setTimeout(detect, SCAN_INTERVAL);
      }
    };

    // Kick off
    timeoutRef.current = setTimeout(detect, SCAN_INTERVAL);
  }, [email, drawBox, stopCamera, onSuccess]);

  const startFaceScan = useCallback(async () => {
    if (!email.trim()) {
      setMessage("Vui lòng nhập email trước");
      return;
    }

    try {
      setStep("loading");
      setMessage("Đang tải mô hình nhận diện...");

      // 🔥 FIX 1: Dùng cached loader — lần 2+ gần như instant
      faceapiRef.current = await loadFaceApi();

      setMessage("Đang lấy dữ liệu khuôn mặt...");

      const res = await axiosInstance.post(`/api/auth/login/face/descriptor`, {
        email,
      });
      const data = res.data;

      if (!data.faceDescriptor) {
        throw new Error(data.message || "Không thể lấy dữ liệu khuôn mặt");
      }

      referenceDescriptorRef.current = new Float32Array(data.faceDescriptor);
      failCountRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      streamRef.current = stream;

      // Set step trước → React render <video> vào DOM
      setStep("scanning");
      setFaceStatus("idle");
      setMessage("Đang khởi động camera...");

      // Đợi React render rồi mới gán srcObject
      setTimeout(() => {
        const video = videoRef.current;
        if (!video) {
          console.error("videoRef vẫn null sau timeout");
          return;
        }
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video
            .play()
            .then(() => {
              setMessage("Đưa khuôn mặt vào khung hình...");
              startDetection();
            })
            .catch(console.error);
        };
      }, 100);
    } catch (err: any) {
      stopCamera();
      setStep("error");
      setMessage(err.message || "Đã xảy ra lỗi");
    }
  }, [email, stopCamera, startDetection]);

  // Cleanup khi unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  return {
    videoRef,
    canvasRef,
    step,
    faceStatus,
    message,
    startFaceScan,
    reset,
  };
}
