"use client";

import Button from "@/components/ui/button";
import useTableLayoutStore from "@/stores/table-layout-store";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function TableLayoutSelector() {
  const { tableLayout, setTableLayout } = useTableLayoutStore();

  return (
    <div className="flex rounded-full">
      <Button
        variant={tableLayout == "list" ? "solid" : "outline"}
        className="rounded-r-none px-6"
        onClick={() => setTableLayout("list")}
      >
        <LayoutList />
      </Button>
      <Button
        variant={tableLayout == "card" ? "solid" : "outline"}
        className="rounded-l-none px-6"
        onClick={() => setTableLayout("card")}
      >
        <LayoutGrid />
      </Button>
    </div>
  );
}
