import type { StudentFilterField } from "@/constants/filters";
import { create } from "zustand";

interface StudentSearchStore {
  searchField: StudentFilterField;
  setSearchField: (searchField: StudentFilterField) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

export const useStudentSearchStore = create<StudentSearchStore>((set) => ({
  searchTerm: "",
  setSearchField: (searchField: StudentFilterField) => {
    set({ searchField });
  },
  searchField: "name",
  setSearchTerm: (searchTerm: string) => {
    set({ searchTerm });
  },
}));
