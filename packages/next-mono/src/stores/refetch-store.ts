import { create } from "zustand";

interface RefetchState {
  refetchCounter: number;
  refetch: () => void;
}

function createRefetchStore() {
  return create<RefetchState>()((set) => ({
    refetchCounter: 0,
    refetch: () =>
      set((state) => ({ refetchCounter: state.refetchCounter + 1 })),
  }));
}

export const useTableRefetchStore = createRefetchStore();

export const useSessionRefetchStore = createRefetchStore();
