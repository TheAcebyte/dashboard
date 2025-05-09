import TabSelector, { type Tab } from "@/components/ui/tab-selector";

const databaseTabs = [
  { id: "students", name: "Students", route: "/database/students" },
  { id: "groups", name: "Groups", route: "/database/groups" },
] as const satisfies Tab[];

type DatabaseTabId = (typeof databaseTabs)[number]["id"];

interface Props {
  selected: DatabaseTabId;
}

export default function DatabaseTabSelector({ selected }: Props) {
  return (
    <div className="w-full border-b border-gray-300">
      <TabSelector tabs={databaseTabs} selected={selected} />
    </div>
  );
}
