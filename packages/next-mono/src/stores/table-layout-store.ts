import { create } from "zustand";

export type TableLayout = "list" | "card";

interface TableLayoutStore {
  tableLayout: TableLayout;
  setTableLayout: (tableLayout: TableLayout) => void;
}

export const useTableLayoutStore = create<TableLayoutStore>((set) => ({
  tableLayout: "list",
  setTableLayout: (tableLayout: TableLayout) => {
    set({ tableLayout });
  },
}));
