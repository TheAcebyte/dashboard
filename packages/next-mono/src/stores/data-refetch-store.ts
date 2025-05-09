import { create } from "zustand";

interface DataRefetchState {
  volatile: {};
  refetch: () => void;
}

export const useDataRefetchStore = create<DataRefetchState>()((set) => ({
  volatile: {},
  refetch: () => set(() => ({ volatile: {} })),
}));
