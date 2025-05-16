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

export const sessionFilterOptions = [
  { id: "group", label: "Group" },
  { id: "status", label: "Status" },
] as const satisfies SelectOption[]

export type SessionFilterField = (typeof sessionFilterOptions)[number]["id"]

export const sessionStudentFilterOptions = [
  { id: "name", label: "Name" },
  { id: "status", label: "Status" },
  { id: "arrival_time", label: "Arrival Time" },
] as const satisfies SelectOption[];

export type SessionStudentFilterField =
  (typeof sessionStudentFilterOptions)[number]["id"];
