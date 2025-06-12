import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
                "text-secondary-fg block p-4 font-medium transition-colors",
                isSelected
                  ? "border-accent-fg text-accent-fg border-b-2"
                  : "hover:text-primary-hover-fg",
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
