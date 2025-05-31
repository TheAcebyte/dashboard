"use client";

import TabSelector, { type Tab } from "@/components/ui/tab-selector";
import { TranslationFunction } from "@/types/utils";
import { useTranslations } from "next-intl";

const getDatabaseTabs = (t: TranslationFunction<"database-page">) => {
  return [
    { id: "students", name: t("students"), route: "/database/students" },
    { id: "groups", name: t("groups"), route: "/database/groups" },
  ] as const satisfies Tab[];
};

type DatabaseTabId = ReturnType<typeof getDatabaseTabs>[number]["id"];

interface Props {
  selected: DatabaseTabId;
}

export default function DatabaseTabSelector({ selected }: Props) {
  const t = useTranslations("database-page");
  const databaseTabs = getDatabaseTabs(t);
  return (
    <div className="w-full border-b border-default-border">
      <TabSelector tabs={databaseTabs} selected={selected} />
    </div>
  );
}
