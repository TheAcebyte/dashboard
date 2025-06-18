"use client";

import type { NavigationTab } from "@/constants/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  tabs: NavigationTab[];
}

export default function SmallSidebar({ tabs }: Props) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 flex flex-col items-center gap-16 p-4">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <ul className="flex flex-col gap-4">
        {tabs.map((tab, index) => {
          const routeMatch = pathname.startsWith(tab.route);
          return (
            <li key={index}>
              <Link
                href={tab.route}
                className={cn(
                  "flex rounded-full p-4 text-secondary-fg transition-colors",
                  routeMatch && "bg-accent-bg text-accent-fg",
                  !routeMatch &&
                    "cursor-pointer hover:bg-primary-hover-bg hover:text-primary-hover-fg",
                )}
              >
                {tab.icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
