"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/hook/useUserStore";

export const useChatSession = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const { user } = useUserStore();

  useEffect(() => {
    let id = "";

    if (user && user.id) {
      // Nếu user login -> ưu tiên lấy id user
      id = user.id as string;
      localStorage.setItem("sessionId", id); // lưu lại để session gộp
    } else {
      // Nếu chưa login -> lấy sessionId từ localStorage hoặc tạo mới
      id =
        localStorage.getItem("sessionId") ||
        Math.random().toString(36).substring(2, 12);
      localStorage.setItem("sessionId", id);
    }

    setSessionId(id);
  }, [user]);

  return sessionId;
};
