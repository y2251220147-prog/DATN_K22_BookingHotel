"use client";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Maximize, X } from "lucide-react";
import Image from "next/image";
import MarkDown from "@/hook/MarkDown";
import axiosInstance from "@/lib/axios";
import { useChatSession } from "@/hook/useChatSession";
import { useChatDragStore } from "@/hook/useChatDragStore";

interface ChatMessage {
  lc: number;
  type: string;
  id: string[];
  kwargs: { content: string };
}

// ── Gợi ý nhanh ───────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  {
    icon: "🛏️",
    label: "Phòng còn trống",
    prompt: "Cho tôi xem danh sách phòng còn trống hiện tại",
  },
  {
    icon: "💰",
    label: "Bảng giá phòng",
    prompt: "Bảng giá các loại phòng tại khách sạn là bao nhiêu?",
  },
  {
    icon: "🏊",
    label: "Tiện ích khách sạn",
    prompt: "Khách sạn có những tiện ích gì?",
  },
  {
    icon: "📅",
    label: "Hướng dẫn đặt phòng",
    prompt: "Tôi muốn đặt phòng, hướng dẫn tôi các bước",
  },
  {
    icon: "🕐",
    label: "Giờ check-in/out",
    prompt: "Giờ nhận phòng và trả phòng là mấy giờ?",
  },
  {
    icon: "❌",
    label: "Chính sách hủy phòng",
    prompt: "Chính sách hủy phòng như thế nào?",
  },
];

export default function ChatBoxAL() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setDraggedRoom, draggedRoom } = useChatDragStore();
  const sessionId = useChatSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    if (!isOpen) return;
    axiosInstance
      .post("/api/chatai/", { sessionId, message: "" })
      .then((res) => {
        if (res.data?.history) setHistory(res.data.history);
      })
      .catch(console.error);
  }, [isOpen]);

  // ── Gửi tin nhắn ─────────────────────────────────────────────────────────
  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    setInput("");
    setIsLoading(true);

    const optimistic: ChatMessage = {
      lc: Date.now(),
      type: "constructor",
      id: ["langchain_core", "messages", "HumanMessage"],
      kwargs: { content: msg },
    };
    setHistory((prev) => [...prev, optimistic]);

    try {
      const res = await axios.post(`${URL_API}/api/chatai`, {
        message: msg,
        sessionId,
      });
      if (res.data) setHistory(res.data.history);
    } catch {
      setHistory((prev) => prev.filter((m) => m.lc !== optimistic.lc));
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Drop handler ─────────────────────────────────────────────────────────
  const handleDrop = () => {
    if (!draggedRoom) return;
    setIsOpen(true);
    setInput((prev) =>
      prev
        ? `${prev}\n- ${draggedRoom.name}`
        : `Khách quan tâm phòng:\n- ${draggedRoom.name}`,
    );
    setDraggedRoom(null);
  };

  return (
    <>
      {/* ── FAB ────────────────────────────────────────────────────────────── */}
      {!isOpen && (
        <div
          className="group fixed bottom-14 right-5 z-50 w-full"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div
            className="fixed rounded-full bg-linear-to-r animate-bounce-light from-blue-500 to-blue-600
              text-white p-1 w-fit cursor-pointer bottom-7 lg:bottom-14 right-5"
            onClick={() => setIsOpen(true)}
            title="Hỗ trợ tìm thông tin nhanh bằng AI"
          >
            <Image
              src="/image/iSeeMascoticenter.gif"
              alt="chatbot"
              width={50}
              height={50}
              unoptimized
              className="object-contain rounded-full"
            />
          </div>
          <div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
            bg-white shadow-2xl border-2 px-4 py-2 rounded-2xl absolute -top-28 -right-7"
          >
            xin chào tôi là lễ tân AI
          </div>
        </div>
      )}

      {/* ── Chat window ──────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`fixed flex flex-col bg-white rounded-xl shadow-lg overflow-hidden z-40
            md:mb-6 md:mr-14 h-[calc(100vh-8rem)] w-[calc(100vw-2rem)]
            ${expand ? "max-w-6xl" : "max-w-lg"} bottom-20 right-4`}
        >
          {/* Header */}
          <div
            className="bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 text-white
            flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">Trợ Lý AI</h2>
              <p className="text-sm opacity-80">Tôi có thể giúp gì cho bạn?</p>
            </div>
            <div className="flex items-center gap-4">
              <Maximize
                onClick={() => setExpand(!expand)}
                className="hidden md:block cursor-pointer hover:scale-110 transition-transform"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-blue-400 transition-colors"
              >
                <X className="w-7 h-7 text-red-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-2 md:px-4 py-3 overflow-y-auto bg-gray-50 flex flex-col">
            {history?.length === 0 ? (
              /* ── Empty state + suggestions ─────────────────────────────── */
              <div className="flex flex-col items-center justify-center h-full gap-6 px-3">
                <div className="text-center">
                  <Image
                    src="/image/iSeeMascoticenter.gif"
                    alt="bot"
                    width={64}
                    height={64}
                    unoptimized
                    className="rounded-full mx-auto mb-3"
                  />
                  <p className="font-semibold text-gray-700 text-base">
                    Xin chào! Tôi là lễ tân AI
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Chọn gợi ý hoặc nhập câu hỏi bên dưới
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.prompt)}
                      className="flex items-center gap-2 bg-white border border-gray-200
                        hover:border-blue-300 hover:bg-blue-50 rounded-xl px-3 py-2.5
                        text-left text-sm text-gray-700 transition-all duration-150
                        hover:shadow-sm active:scale-[0.98]"
                    >
                      <span className="text-base shrink-0">{s.icon}</span>
                      <span className="leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Messages list ──────────────────────────────────────────── */
              <>
                {history.map((m, i) => {
                  const isUser = m.id.includes("HumanMessage");
                  const isAssistant = m.id.includes("AIMessage");
                  const text = m.kwargs?.content || "";
                  return (
                    <div
                      key={i}
                      className={`mb-4 flex items-end ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {isAssistant && (
                        <div className="mr-1 p-1 rounded-full bg-blue-500 shrink-0">
                          <Image
                            src="/image/chatbot-chat.avif"
                            alt="bot"
                            width={50}
                            height={50}
                            className="w-8 h-8 object-contain rounded-full"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-1
                        ${
                          isUser
                            ? "bg-blue-500 text-white rounded-br-none text-end"
                            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <MarkDown>{text}</MarkDown>
                      </div>
                      {isUser && (
                        <div className="ml-1 p-1 rounded-full bg-blue-500 shrink-0">
                          <Image
                            src="/image/anhdaidien.jpg"
                            alt="user"
                            width={50}
                            height={50}
                            className="w-8 h-8 object-contain rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quick suggestions nhỏ sau khi đã có lịch sử */}
                {!isLoading && (
                  <div className="flex flex-wrap gap-2 mt-1 mb-3">
                    {SUGGESTIONS.slice(0, 4).map((s) => (
                      <button
                        key={s.label}
                        onClick={() => sendMessage(s.prompt)}
                        className="flex items-center gap-1.5 bg-white border border-gray-200
                          hover:border-blue-300 hover:bg-blue-50 rounded-full px-3 py-1.5
                          text-xs text-gray-600 transition-all duration-150"
                      >
                        <span>{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="mr-1 p-1 rounded-full bg-blue-500 shrink-0">
                  <Image
                    src="/image/chatbot-chat.avif"
                    alt="bot"
                    width={50}
                    height={50}
                    className="w-8 h-8 object-contain rounded-full"
                  />
                </div>
                <div className="bg-gray-200 rounded-lg rounded-bl-none p-3">
                  <div className="flex space-x-1.5">
                    {[0, 100, 200].map((d) => (
                      <div
                        key={d}
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t p-3 bg-white"
          >
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 w-9 h-9
                  flex items-center justify-center transition-colors disabled:opacity-40"
                disabled={!input.trim() || isLoading}
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
