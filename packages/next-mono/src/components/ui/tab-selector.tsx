import { cn } from "@/lib/utils";
import Link from "next/link";

export interface Tab {
  id: string;
  name: string;
  route: string;
}

interface Props {
  tabs: Tab[];
  selected: string;
}

export default function TabSelector({ tabs, selected }: Props) {
  return (
    <ul className="flex">
      {tabs.map((tab) => {
        const isSelected = tab.id == selected;
        return (
          <li key={tab.id}>
            <Link
              href={tab.route}
              className={cn(
                "block p-4 font-medium text-gray-500 transition-colors",
                isSelected
                  ? "border-b-2 border-green-700 text-green-700"
                  : "hover:text-zinc-700",
              )}
            >
              {tab.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
