import { create } from "zustand";

interface SelectedSessionState {
  sessionId: string;
  setSessionId: (session: string) => void;
}

export const useSelectedSessionStore = create<SelectedSessionState>()(
  (set) => ({
    sessionId: "",
    setSessionId: (sessionId) => set((state) => ({ sessionId: sessionId })),
  }),
);
