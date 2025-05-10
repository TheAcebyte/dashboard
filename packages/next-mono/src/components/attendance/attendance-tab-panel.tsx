"use client";

import Select from "@/components/ui/select";
import TabSelector, { type Tab } from "@/components/ui/tab-selector";
import { type GroupRecord } from "@/db/schema/groups";
import useAttendanceGroupStore from "@/stores/attendance-group-store";

const attendanceTabs = [
  { id: "active", name: "Active", route: "/attendance/active" },
  { id: "history", name: "History", route: "/attendance/history" },
] as const satisfies Tab[];

type AttendanceTabId = (typeof attendanceTabs)[number]["id"];

interface Props {
  selected: AttendanceTabId;
  groups: GroupRecord[];
}

export default function AttendanceTabPanel({ selected, groups }: Props) {
  const { group, setGroup } = useAttendanceGroupStore();
  const noGroupsFound = groups.length == 0;
  const groupOptions = groups.map(({ name }) => ({
    id: name,
    label: name,
  }));

  return (
    <div className="flex w-full items-center justify-between border-b border-gray-300">
      <TabSelector tabs={attendanceTabs} selected={selected} />
      {!noGroupsFound && (
        <div className="flex items-center gap-4">
          <h2 className="font-medium text-gray-500">Group</h2>
          <Select
            options={groupOptions}
            offsetY={16}
            value={group}
            setValue={setGroup}
            className="font-medium"
          />
        </div>
      )}
    </div>
  );
}
