"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
}

export default function StudentSearchbar({ className }: Props) {
  const [activeDropdown, setActiveDropdown] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-full border border-gray-200 px-4",
        className,
      )}
    >
      <Search className="text-zinc-900" />
      <input
        type="text"
        placeholder="Search for students"
        className="min-w-0 flex-1 outline-none placeholder:text-gray-400"
      />
      <Dropdown registerActive={setActiveDropdown} className="py-2">
        <DropdownTrigger className="flex cursor-pointer items-center gap-2 font-medium text-zinc-900">
          By Name
          <ChevronDown
            className={cn(
              "size-5 transition-transform",
              activeDropdown && "rotate-180",
            )}
          />
        </DropdownTrigger>
        <DropdownContent className="w-[100px] rounded-2xl border border-gray-200 bg-white">
          Fill this up
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
