import { navigationTabs } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SmallSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky flex size-full flex-col items-center gap-16 border-r border-gray-300 p-4">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <ul className="flex flex-col gap-4">
        {navigationTabs.map((tab, index) => {
          const routeMatch = pathname.startsWith(tab.route);
          return (
            <li key={index}>
              <Link
                href={tab.route}
                className={cn(
                  "flex rounded-full p-4 text-gray-500 transition-colors",
                  routeMatch && "bg-green-50 text-green-700",
                  !routeMatch &&
                    "cursor-pointer hover:bg-gray-50 hover:text-zinc-700",
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
