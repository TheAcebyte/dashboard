import { SelectOption } from "@/components/ui/select";

export const studentFilterOptions = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age" },
  { id: "cne", label: "CNE" },
  { id: "group", label: "Group" },
] as const satisfies SelectOption[];

export type StudentFilterField = (typeof studentFilterOptions)[number]["id"];

export const groupFilterOptions = [
  { id: "name", label: "Name" },
] as const satisfies SelectOption[];

export type GroupFilterField = (typeof groupFilterOptions)[number]["id"];
