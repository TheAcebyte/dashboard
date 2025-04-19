import TabSelector, { type Tab } from "@/components/ui/tab-selector";

const databaseTabs: Tab[] = [
  { id: "students", name: "Students", route: "/database/students" },
  { id: "groups", name: "Groups", route: "/database/groups" },
];

interface Props {
  selected: "students" | "groups";
}

export default function DatabaseTabSelector({ selected }: Props) {
  return (
    <div className="w-full border-b border-gray-200">
      <TabSelector tabs={databaseTabs} selected={selected} />
    </div>
  );
}
