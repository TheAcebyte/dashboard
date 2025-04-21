"use client";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  dropdownContext,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useContext, useState } from "react";

interface Props {
  className?: string;
}

export default function StudentSearchbar({ className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-full border border-gray-300 px-4",
        className,
      )}
    >
      <Search className="text-zinc-900" />
      <input
        type="text"
        placeholder="Search for students"
        className="min-w-0 flex-1 outline-none placeholder:text-gray-400"
      />
      <Dropdown className="py-2">
        <DropdownTrigger>
          <StudentSearchbarDropdownTrigger />
        </DropdownTrigger>
        <DropdownContent
          align="right"
          className="w-[100px] rounded-2xl border border-gray-300 bg-white"
        >
          Fill this up yeah dawg do yo thing
        </DropdownContent>
      </Dropdown>
    </div>
  );
}

function StudentSearchbarDropdownTrigger() {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "StudentSearchbarDropdownTrigger must be placed inside a DropdownTrigger component.",
    );
  }

  const { active } = contextValue;
  return (
    <div className="flex cursor-pointer items-center gap-2 font-medium text-zinc-900">
      <p>By Name</p>
      <ChevronDown
        className={cn("size-5 transition-transform", active && "rotate-180")}
      />
    </div>
  );
}
