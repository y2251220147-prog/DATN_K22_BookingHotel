"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { URL_API } from "@/lib/fetcher";
import axiosInstance from "@/lib/axios";
import { generateVoicePrompt } from "@/lib/voice-prompts";

const WAKE_WORD = "xin chào";
const SILENCE_TIMEOUT = 4000;

// Add type definitions for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type VoiceState =
  | "idle"
  | "listening_wake"
  | "listening_command"
  | "processing"
  | "navigating"
  | "error";

export const removeWakePhrase = (text: string) => {
  const noisePatterns = [
    "dạ tôi nghe bạn cần gì à",
    "tôi nghe bạn cần gì à",
    "tôi nghe bạn cần gì",
    "dạ tôi nghe",
    "xin chào",
  ];

  const regex = new RegExp(noisePatterns.join("|"), "gi");
  return text.replace(regex, "").replace(/\s+/g, " ").trim();
};

export function useVoiceAssistant() {
  const router = useRouter();
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isListeningRef = useRef(false);
  const commandBufferRef = useRef("");
  const isRestartingRef = useRef(false); // thêm ref này

  const restartMic = useCallback(() => {
    if (isRestartingRef.current || isListeningRef.current) return;
    if (!recognitionRef.current) return;
    if (
      stateRef.current !== "listening_wake" &&
      stateRef.current !== "listening_command"
    )
      return;

    isRestartingRef.current = true;
    setTimeout(() => {
      if (!isListeningRef.current) {
        try {
          isListeningRef.current = true;
          recognitionRef?.current?.start();
          console.log("🔄 Mic restarted");
        } catch (e) {
          isListeningRef.current = false;
          console.error("Restart error:", e);
        }
      }
      isRestartingRef.current = false;
    }, 400);
  }, []);
  // ✅ stateRef để tránh stale closure
  const stateRef = useRef<VoiceState>("idle");
  const updateState = useCallback((s: VoiceState) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const isSpeakingRef = useRef(false);

  // ── Text-to-Speech ──
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined") return;

    isSpeakingRef.current = true;
    try {
      recognitionRef.current?.stop();
    } catch { }

    fetch(`${URL_API}/api/chatai/tts?text=${encodeURIComponent(text)}`)
      .then((res) => {
        console.log("Status:", res.status);
        console.log("Content-Type:", res.headers.get("content-type"));
        return res.arrayBuffer();
      })
      .then((buffer) => {
        console.log("Buffer size:", buffer.byteLength);
        const view = new Uint8Array(buffer.slice(0, 4));
        console.log(
          "Magic bytes:",
          Array.from(view).map((b) => b.toString(16)),
        );

        if (buffer.byteLength === 0) {
          console.error("Empty audio buffer!");
          isSpeakingRef.current = false;
          return;
        }

        // Thử lần lượt các type phổ biến
        const magicHex = Array.from(new Uint8Array(buffer.slice(0, 4)))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        let audioType = "audio/mpeg";
        if (magicHex.startsWith("52494646")) audioType = "audio/wav";
        else if (magicHex.startsWith("4f676753")) audioType = "audio/ogg";
        else if (magicHex.startsWith("664c6143")) audioType = "audio/flac";

        console.log("Detected type:", audioType);

        const blob = new Blob([buffer], { type: audioType });
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);

        audio.oncanplaythrough = () => {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((e) => {
              console.error("TTS play error:", e);
              isSpeakingRef.current = false;
            });
          }
        };

        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          onEnd?.();
          isSpeakingRef.current = false;
          commandBufferRef.current = "";
        };

        audio.onerror = () => {
          console.error(
            "Audio error:",
            audio.error?.code,
            audio.error?.message,
          );
          URL.revokeObjectURL(blobUrl);
          isSpeakingRef.current = false;
        };

        audio.src = blobUrl;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error("TTS play error:", e);
            isSpeakingRef.current = false;
          });
        }
      })
      .catch((e) => {
        console.error("TTS fetch error:", e);
        isSpeakingRef.current = false;
      });
  }, []);

  const handleCommand = useCallback(
    async (command: string) => {
      const cleanCommand = removeWakePhrase(command);
      if (!cleanCommand) {
        updateState("listening_wake");
        setFeedback("🎤 Đang nghe...");
        return;
      }

      updateState("processing");
      setFeedback(`Đang xử lý: "${cleanCommand}"`);

      try {
        const prompt = generateVoicePrompt(cleanCommand);

        const res = await axiosInstance.post(`/api/chatai/voice/parse`, {
          prompt,
        });

        const data = res.data;

        // --- 1. Định nghĩa Helper để tái sử dụng ---
        const resetAfterDelay = (delay = 3000) => {
          setTimeout(() => {
            updateState("idle");
            setFeedback("");
          }, delay);
        };

        const navigateAfterDelay = (path: string, delay = 900) => {
          updateState("navigating");
          setTimeout(() => {
            router.push(path);
            updateState("idle");
            setFeedback("");
            setTranscript("");
          }, delay);
        };

        // --- 2. Xử lý Logic bằng Switch-Case ---
        switch (data.intent) {
          case "view_room":
            if (data.room) {
              speak(`Đang chuyển đến phòng ${data.room.roomNumber}`);
              setFeedback(
                `✅ Đang chuyển đến phòng ${data.room.roomNumber}...`,
              );
              navigateAfterDelay(
                `/rooms/${data.room.roomType.id}/${data.room.id}`,
              );
            } else {
              speak(`Xin lỗi, không tìm thấy phòng ${data.roomNumber || ""}`);
              updateState("error");
              setFeedback(`❌ Không tìm thấy phòng ${data.roomNumber || ""}`);
              resetAfterDelay();
            }
            break;

          case "search_by_type":
            if (data.rooms?.length > 0) {
              speak(
                `Tìm thấy ${data.rooms.length} phòng ${data.roomType}. Đang chuyển trang`,
              );
              setFeedback(
                `🛏️ Tìm thấy ${data.rooms.length} phòng ${data.roomType}`,
              );

              // Luôn vào trang loại phòng, không nhảy thẳng vào phòng cụ thể
              navigateAfterDelay(`/rooms/${data.roomTypeId}`, 800);
            } else {
              speak(`Xin lỗi, hiện không có phòng ${data.roomType} trống`);
              updateState("error");
              setFeedback(`❌ Không có phòng ${data.roomType} trống`);
              resetAfterDelay();
            }
            break;

          case "search_room":
            speak("Đang tìm phòng cho bạn");
            setFeedback("🔍 Đang tìm phòng...");
            navigateAfterDelay(
              `/rooms?q=${encodeURIComponent(data.criteria || "")}`,
              800,
            );
            break;

          case "blog_post":
            if (data.blogPost) {
              console.log("data.blogPost", data.blogPost.slug);

              speak("Đang chuyển đến trang bài viết");
              setFeedback("📖 Đang chuyển đến trang blog...");
              navigateAfterDelay(`/blog/${data.blogPost.slug}`, 500);
            } else {
              speak(data.answer || "Không tìm thấy bài viết phù hợp");
              updateState("error");
              setFeedback("❌ Không tìm thấy bài viết");
              resetAfterDelay();
            }
            break;

          // Xóa case "go_home", thay bằng
          case "navigate":
            const pageConfig: Record<
              string,
              { label: string; spoken: string }
            > = {
              home: { label: "🏠 Trang chủ", spoken: "trang chủ" },
              blog: { label: "📖 Trang blog", spoken: "trang blog" },
              about: {
                label: "ℹ️ Trang giới thiệu",
                spoken: "trang giới thiệu",
              },
              gallery: {
                label: "🖼️ Trang bộ sưu tập",
                spoken: "trang bộ sưu tập",
              },
            };

            const page = pageConfig[data.page] ?? {
              label: "🔗 Trang yêu cầu",
              spoken: "trang yêu cầu",
            };

            speak(`Đang chuyển đến ${page.spoken}`);
            setFeedback(`${page.label}...`);
            navigateAfterDelay(data.path, 500);
            break;

          case "hotel_info":
            // Nếu là hỏi đáp, chỉ cần nói và hiện feedback, không điều hướng
            if (data.answer) {
              speak(data.answer);
              setFeedback(`ℹ️ ${data.answer}`);
              resetAfterDelay(8000); // Cho khách 8 giây để đọc
            } else {
              speak("Dạ, hiện tại tôi chưa rõ thông tin này ạ.");
              updateState("error");
              resetAfterDelay();
            }
            break;
          case "search_by_criteria":
            if (data.rooms?.length > 0) {
              speak(`Đang chuyển đến phòng phù hợp nhất`);
              setFeedback(`🔍 Đang tìm phòng phù hợp...`);
              navigateAfterDelay(data.path, 1200);
            } else {
              speak(data.answer ?? "Xin lỗi, không tìm thấy phòng phù hợp");
              updateState("error");
              setFeedback(
                `❌ ${data.answer ?? "Không tìm thấy phòng phù hợp"}`,
              );
              resetAfterDelay();
            }
            break;
          default:
            speak("Xin lỗi tôi chưa hiểu");
            updateState("error");
            setFeedback('❓ Không hiểu lệnh của bạn: "' + cleanCommand + '"');
            resetAfterDelay();
            break;
        }
      } catch (error) {
        console.error("Voice Error:", error);
        speak("Xin lỗi hệ thống không nhận được yêu cầu của bạn");
        updateState("error");
        setFeedback("❌ Lỗi kết nối máy chủ");
        setTimeout(() => {
          updateState("idle");
          setFeedback("");
        }, 3000);
      }
    },
    [router, updateState, speak],
  );
  // ── Khởi động nhận diện giọng nói ──
  const startRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback("❌ Trình duyệt không hỗ trợ nhận diện giọng nói");
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isListeningRef.current = true;
      console.log("🎤 Mic started, waiting for wake word...");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (isSpeakingRef.current) return;

      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript.toLowerCase().trim();
        if (event.results[i].isFinal) final += t + " ";
        else interim += t;
      }

      const combined = (final + interim).toLowerCase().trim();

      if (stateRef.current === "listening_command") {
        // Chỉ hiển thị transcript khi đang nghe lệnh
        const cmdText = combined.includes(WAKE_WORD)
          ? combined.split(WAKE_WORD).pop()?.trim() || ""
          : combined;

        setTranscript(cmdText);
        commandBufferRef.current = cmdText;

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (commandBufferRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            const cmd = commandBufferRef.current.trim();
            if (cmd) {
              console.log("⏱️ Silence detected, processing:", cmd);
              commandBufferRef.current = "";
              recognition.stop();
              handleCommand(cmd);
            }
          }, SILENCE_TIMEOUT);
        }
      } else if (stateRef.current === "listening_wake") {
        // Đang chờ từ khóa: Không hiện transcript lên UI
        if (combined.includes(WAKE_WORD)) {
          console.log("🔔 Wake word detected!");
          updateState("listening_command");
          setFeedback("👂 Đang nghe lệnh...");
          setTranscript(""); // Xóa text "xin chào" để bắt đầu nhận lệnh mới
          commandBufferRef.current = "";
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          speak("Dạ, tôi nghe. Bạn cần gì ạ?");
        }
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      console.log("🔴 Mic ended, state:", stateRef.current);

      // ✅ Chỉ dùng restartMic, xóa setTimeout bên dưới
      restartMic();
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") return;
      if (e.error === "aborted") return;
      console.error("🚨 Speech error:", e.error);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Start error:", e);
    }
  }, [handleCommand, updateState, speak]);

  const start = useCallback(() => {
    updateState("listening_wake");
    setFeedback('Đang chờ "hey"...');
    startRecognition();
  }, [startRecognition, updateState]);

  const stop = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    window.speechSynthesis?.cancel();
    try {
      recognitionRef.current?.stop();
    } catch { }
    isListeningRef.current = false;
    updateState("idle");
    setFeedback("");
    setTranscript("");
    commandBufferRef.current = "";
  }, [updateState]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { state, transcript, feedback, start, stop, speak };
}
