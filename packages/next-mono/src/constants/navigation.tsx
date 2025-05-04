import { ChartNoAxesColumn, Database, Settings } from "lucide-react";
import type { ReactNode } from "react";

interface NavigationTab {
  name: string;
  icon: ReactNode;
  route: string;
}

export const navigationTabs: NavigationTab[] = [
  { name: "Attendance", icon: <ChartNoAxesColumn />, route: "/attendance" },
  { name: "Database", icon: <Database />, route: "/database" },
  { name: "Settings", icon: <Settings />, route: "/settings" },
] as const;
