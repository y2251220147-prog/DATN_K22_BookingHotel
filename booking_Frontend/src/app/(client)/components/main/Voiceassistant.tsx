"use client";
import { removeWakePhrase, useVoiceAssistant } from "@/hook/useVoiceAssistant";
import { useEffect, useRef } from "react";

const STATE_CONFIG = {
  idle: { color: "#374151", pulse: false, icon: "🎤", label: "" },
  listening_wake: { color: "#6366f1", pulse: false, icon: "👂", label: "" },
  listening_command: {
    color: "#f59e0b",
    pulse: true,
    icon: "🎙️",
    label: "Đang nghe lệnh...",
  },
  processing: {
    color: "#3b82f6",
    pulse: true,
    icon: "⚡",
    label: "Đang xử lý...",
  },
  navigating: {
    color: "#22c55e",
    pulse: false,
    icon: "✅",
    label: "Đang chuyển trang...",
  },
  error: { color: "#ef4444", pulse: false, icon: "❌", label: "Lỗi" },
};

let globalUnlocked = false;

export default function VoiceAssistant() {
  const { state, transcript, feedback, start, stop } = useVoiceAssistant();
  const cfg = STATE_CONFIG[state];

  // 2 ref riêng biệt, đúng kiểu
  const startRef = useRef(start);
  const stopRef = useRef(stop);
  const stateRef = useRef(state);

  useEffect(() => {
    startRef.current = start;
  }, [start]);
  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;
    let animFrameId: number | null = null;

    const startPassiveListening = async () => {
      try {
        // Xin quyền mic ngay khi load trang
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 512;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detect = () => {
          analyser!.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          // Nếu phát hiện tiếng ồn đủ lớn → start recognition
          if (avg > 15 && stateRef.current === "idle") {
            startRef.current();
          }

          animFrameId = requestAnimationFrame(detect);
        };

        detect();
      } catch (e) {
        console.error("Mic permission denied:", e);
      }
    };

    // Unlock AudioContext bằng click lần đầu
    const unlock = () => {
      if (!globalUnlocked) {
        globalUnlocked = true;
        startPassiveListening();
      }
    };

    document.addEventListener("click", unlock, { once: true });

    return () => {
      document.removeEventListener("click", unlock);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (microphone) microphone.disconnect();
      if (audioContext) audioContext.close();
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const showUI = state !== "idle" && state !== "listening_wake";
  if (!showUI) return null;

  return (
    <>
      <div
        className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
        style={{ userSelect: "none" }}
      >
        {(feedback || transcript) && (
          <div
            className="max-w-xs rounded-2xl px-3 py-2 text-sm shadow-2xl"
            style={{
              background: "rgba(15,23,42,0.95)",
              border: `1px solid ${cfg.color}40`,
              backdropFilter: "blur(12px)",
              color: "#e2e8f0",
            }}
          >
            {feedback && (
              <p className="font-medium mb-1" style={{ color: cfg.color }}>
                {feedback}
              </p>
            )}
            {transcript && (
              <p className="text-xs opacity-60 italic">
                {removeWakePhrase(transcript)}
              </p>
            )}
          </div>
        )}

        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
            border: `2px solid ${cfg.color}`,
            boxShadow: `0 0 20px ${cfg.color}60`,
          }}
        >
          {cfg.pulse && (
            <>
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${cfg.color}`,
                  animation: "voicePulse 1.5s ease-out infinite",
                }}
              />
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${cfg.color}`,
                  animation: "voicePulse 1.5s ease-out infinite 0.5s",
                }}
              />
            </>
          )}
          <span className="text-lg relative z-10">{cfg.icon}</span>
        </div>

        {cfg.label && (
          <p
            className="text-xs font-medium"
            style={{ color: cfg.color, textShadow: "0 0 8px currentColor" }}
          >
            {cfg.label}
          </p>
        )}
      </div>

      {state === "listening_command" && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      <style>{`
        @keyframes voicePulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
