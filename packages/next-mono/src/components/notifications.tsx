"use client";

import { buttonStyles } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { CheckCheck } from "lucide-react";
import { useRef, useState } from "react";

export default function Notifications() {
  const initialTimeRef = useRef(Date.now());
  const [pending, setPending] = useState(true);

  return (
    <Dropdown>
      <DropdownTrigger
        className={cn(buttonStyles.outline, "relative aspect-square p-4")}
      >
        <Bell className="relative" />
        {pending && (
          <div className="absolute top-4 right-[18px] size-2 rounded-full bg-red-700 outline-3 outline-white" />
        )}
      </DropdownTrigger>
      <DropdownContent
        align="right"
        offsetY={8}
        className="max-h-[400px] overflow-y-auto rounded-2xl border border-gray-300 bg-white"
      >
        <header className="flex items-center justify-between gap-16 border-b border-gray-300 px-4 py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-zinc-900">
              Notifications
            </h1>
            <p className="aspect-square rounded-full bg-gray-50 p-1 text-sm font-semibold text-gray-500">
              3
            </p>
          </div>
          <CheckCheck
            size={20}
            className={pending ? "text-gray-500" : "text-green-700"}
          />
        </header>
      </DropdownContent>
    </Dropdown>
  );
}
