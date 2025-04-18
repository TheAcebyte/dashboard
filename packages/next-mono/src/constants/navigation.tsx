import { ChartNoAxesColumn, Database, Settings } from "lucide-react";
import type { ReactElement } from "react";

interface NavigationTab {
  name: string;
  icon: ReactElement;
  route: string;
}

export const navigationTabs: NavigationTab[] = [
  { name: "Attendance", icon: <ChartNoAxesColumn />, route: "/attendance" },
  { name: "Database", icon: <Database />, route: "/database" },
  { name: "Settings", icon: <Settings />, route: "/settings" },
];
