"use client";

import Button from "@/components/ui/button";
import useDataLayoutStore from "@/stores/data-layout-store";
import { LayoutGrid, LayoutList } from "lucide-react";

export default function DataLayoutSelector() {
  const { dataLayout, setDataLayout } = useDataLayoutStore();

  return (
    <div className="flex rounded-full">
      <Button
        variant={dataLayout == "table" ? "solid" : "outline"}
        className="rounded-r-none px-6"
        onClick={() => setDataLayout("table")}
      >
        <LayoutList />
      </Button>
      <Button
        variant={dataLayout == "card" ? "solid" : "outline"}
        className="rounded-l-none px-6"
        onClick={() => setDataLayout("card")}
      >
        <LayoutGrid />
      </Button>
    </div>
  );
}
