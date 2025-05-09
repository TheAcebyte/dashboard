import { create } from "zustand";

interface CardRefetchState {
  volatile: {};
  refetchedPage: number;
  refetch: (page: number) => void;
}

export const useCardRefetchStore = create<CardRefetchState>()((set) => ({
  volatile: {},
  refetchedPage: 0,
  refetch: (page) => set(() => ({ volatile: {}, refetchedPage: page })),
}));
