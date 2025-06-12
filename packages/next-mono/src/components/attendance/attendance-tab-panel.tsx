"use client";

import Select from "@/components/ui/select";
import TabSelector, { type Tab } from "@/components/ui/tab-selector";
import { type GroupRecord } from "@/db/schema/groups";
import useAttendanceGroupStore from "@/stores/attendance-group-store";
import { TranslationFunction } from "@/types/utils";
import { useTranslations } from "next-intl";

const getAttendanceTabs = (t: TranslationFunction<"attendance-page">) => {
  return [
    { id: "active", name: t("active"), route: "/attendance/active" },
    { id: "history", name: t("history"), route: "/attendance/history" },
  ] as const satisfies Tab[];
};

type AttendanceTabId = ReturnType<typeof getAttendanceTabs>[number]["id"];

interface Props {
  selected: AttendanceTabId;
  groups: GroupRecord[];
}

export default function AttendanceTabPanel({ selected, groups }: Props) {
  const t = useTranslations("attendance-page");
  const attendanceTabs = getAttendanceTabs(t);

  const { group, setGroup } = useAttendanceGroupStore();
  const noGroupsFound = groups.length == 0;
  const groupOptions = groups.map(({ name }) => ({
    id: name,
    label: name,
  }));

  return (
    <div className="border-default-border flex w-full items-center justify-between border-b">
      <TabSelector tabs={attendanceTabs} selected={selected} />
      {!noGroupsFound && (
        <div className="flex items-center gap-4">
          <h2 className="text-secondary-fg font-medium">{t("group")}</h2>
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
