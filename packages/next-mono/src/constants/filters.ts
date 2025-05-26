import type { SelectOption } from "@/components/ui/select";
import type { TranslationFunction } from "@/types/utils";

export const getStudentFilterOptions = (t: TranslationFunction<"filters">) => {
  return [
    { id: "name", label: t("name") },
    { id: "age", label: t("age") },
    { id: "cne", label: t("cne") },
    { id: "group", label: t("group") },
  ] as const satisfies SelectOption[];
};

export type StudentFilterField = ReturnType<
  typeof getStudentFilterOptions
>[number]["id"];

export const getGroupFilterOptions = (t: TranslationFunction<"filters">) => {
  return [{ id: "name", label: t("name") }] as const satisfies SelectOption[];
};

export type GroupFilterField = ReturnType<
  typeof getGroupFilterOptions
>[number]["id"];

export const sessionFilterOptions = [
  { id: "group", label: "Group" },
  { id: "status", label: "Status" },
] as const satisfies SelectOption[];

export type SessionFilterField = (typeof sessionFilterOptions)[number]["id"];

export const sessionStudentFilterOptions = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
] as const satisfies SelectOption[];

export type SessionStudentFilterField =
  (typeof sessionStudentFilterOptions)[number]["id"];
