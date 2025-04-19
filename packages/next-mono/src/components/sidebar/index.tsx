"use client";

import LargeSidebar from "@/components/sidebar/large-sidebar";
import SmallSidebar from "@/components/sidebar/small-sidebar";
import useMediaQuery from "@/hooks/use-media-query";

export default function Sidebar() {
  const match = useMediaQuery("(max-width: 1000px)");
  if (match == "server") return null;
  if (match == "no-match") {
    return (
      <div className="min-h-screen">
        <LargeSidebar />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <SmallSidebar />
    </div>
  );
}
