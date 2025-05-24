import type { TranslationFunction } from "@/types/utils";
import { ChartNoAxesColumn, Database, Settings } from "lucide-react";
import type { ReactNode } from "react";

export interface NavigationTab {
  name: string;
  icon: ReactNode;
  route: string;
}

export const getNavigationTabs = (t: TranslationFunction) => {
  return [
    {
      name: t("attendance"),
      icon: <ChartNoAxesColumn />,
      route: "/attendance",
    },
    {
      name: t("database"),
      icon: <Database />,
      route: "/database",
    },
    {
      name: t("settings"),
      icon: <Settings />,
      route: "/settings",
    },
  ] as const satisfies NavigationTab[];
};
