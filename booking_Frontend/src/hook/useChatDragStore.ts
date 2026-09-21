import { create } from "zustand";
import { IRoomType } from "@/hook/roomTypeStore";
interface ChatDragState {
  draggedRoom: IRoomType | null;
  setDraggedRoom: (room: IRoomType | null) => void;
}

export const useChatDragStore = create<ChatDragState>((set) => ({
  draggedRoom: null,
  setDraggedRoom: (room) => set({ draggedRoom: room }),
}));
