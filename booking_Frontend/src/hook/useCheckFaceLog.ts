// src/hook/useCheckFaceLog.ts
import { create } from "zustand";
import { URL_API } from "@/lib/fetcher";
import axiosInstance from "@/lib/axios";

interface CheckFaceState {
  email: string;
  hasFace: boolean;
  checked: boolean;
  loading: boolean;
  checkFace: (email: string) => Promise<void>;
  reset: () => void;
}

export const useCheckFaceLog = create<CheckFaceState>((set, get) => ({
  email: "",
  hasFace: false,
  checked: false,
  loading: false,

  checkFace: async (email: string) => {
    if (get().email === email && get().checked) return;
    if (!email || !email.includes("@")) {
      set({ hasFace: false, checked: false });
      return;
    }

    set({ loading: true, email });

    try {
      const res = await axiosInstance.post(`/api/auth/login/face/descriptor`, {
        email,
      });
      const data = res.data;
      set({
        hasFace: res.data && !!data.faceDescriptor,
        checked: true,
        loading: false,
      });
    } catch {
      set({ hasFace: false, checked: true, loading: false });
    }
  },

  reset: () =>
    set({ email: "", hasFace: false, checked: false, loading: false }),
}));
