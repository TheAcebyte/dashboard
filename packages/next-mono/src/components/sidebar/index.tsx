"use client";

import LargeSidebar from "@/components/sidebar/large-sidebar";
import SmallSidebar from "@/components/sidebar/small-sidebar";
import { getNavigationTabs } from "@/constants/navigation";
import useMediaQuery from "@/hooks/use-media-query";
import { useTranslations } from "next-intl";

export default function Sidebar() {
  const t = useTranslations("sidebar");
  const navigationTabs = getNavigationTabs(t);
  const match = useMediaQuery("(max-width: 1024px)");

  if (match == "server") return null;
  return (
    <div className="min-h-screen border-r border-default-border">
      {match == "no-match" ? (
        <LargeSidebar tabs={navigationTabs} />
      ) : (
        <SmallSidebar tabs={navigationTabs} />
      )}
    </div>
  );
}
