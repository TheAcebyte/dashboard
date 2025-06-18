import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  enabledNotifications: boolean;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      enabledNotifications: true,
      toggleNotifications: () =>
        set((state) => ({ enabledNotifications: !state.enabledNotifications })),
    }),
    { name: "settings-storage" },
  ),
);
