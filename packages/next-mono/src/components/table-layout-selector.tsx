"use client";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useState } from "react";

export type TableLayout = "list" | "card";

interface Props {
  initialLayout: TableLayout;
}

export default function TableLayoutSelector({ initialLayout }: Props) {
  const [tableLayout, setTableLayout] = useState(initialLayout);

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
