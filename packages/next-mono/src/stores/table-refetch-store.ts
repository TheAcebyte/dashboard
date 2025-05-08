import { create } from "zustand";

interface TableRefetchState {
  volatile: {};
  refetch: () => void;
}

export const useTableRefetchStore = create<TableRefetchState>()((set) => ({
  volatile: {},
  refetch: () => set(() => ({ volatile: {} })),
}));
