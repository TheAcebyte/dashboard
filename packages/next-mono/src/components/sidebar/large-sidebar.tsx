"use client";

import Logo from "@/components/logo";
import { navigationTabs } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LargeSidebar() {
  const pathname = usePathname();
  return (
    <div className="sticky flex size-full flex-col gap-16 border-r border-gray-300">
      <div className="px-6 py-4">
        <Logo />
      </div>
      <ul className="flex flex-col gap-4">
        {navigationTabs.map((tab, index) => {
          const routeMatch = pathname.startsWith(tab.route);
          return (
            <li key={index}>
              <Link
                href={tab.route}
                className={cn(
                  "relative flex gap-4 py-2 pr-32 pl-8 text-gray-500 transition-colors",
                  routeMatch && "bg-green-50 text-green-700",
                  !routeMatch && "hover:bg-gray-50 hover:text-zinc-700",
                )}
              >
                {tab.icon}
                <p className="font-medium">{tab.name}</p>
                {routeMatch && (
                  <div className="absolute top-0 left-0 h-full w-[2px] bg-green-700" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
