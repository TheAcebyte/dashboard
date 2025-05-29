"use client";

import Logo from "@/components/logo";
import type { NavigationTab } from "@/constants/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface Props {
  tabs: NavigationTab[];
}

export default function LargeSidebar({ tabs }: Props) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 flex flex-col gap-16">
      <div className="px-6 py-4">
        <Logo />
      </div>
      <ul className="flex flex-col gap-4 w-[300px]">
        {tabs.map((tab, index) => {
          const routeMatch = pathname.startsWith(tab.route);
          return (
            <li key={index}>
              <Link
                href={tab.route}
                className={cn(
                  "relative flex gap-4 py-2 px-8 text-gray-500 transition-colors",
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
