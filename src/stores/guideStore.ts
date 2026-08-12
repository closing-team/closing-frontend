import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GuideState {
  // STEP1에서 입력한 희망 영업 종료일, YYYYMMDD. 미입력 시 빈 문자열
  dueDate: string;
  setDueDate: (value: string) => void;
}

export const useGuideStore = create<GuideState>()(
  persist(
    (set) => ({
      dueDate: "",
      setDueDate: (dueDate) => set({ dueDate }),
    }),
    {
      name: "guide-store",
    },
  ),
);
