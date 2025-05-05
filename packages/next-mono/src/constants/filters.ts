import { SelectOption } from "@/components/ui/select";

export const studentFilterOptions = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age" },
  { id: "cne", label: "CNE" },
  { id: "group", label: "Group" },
] as const satisfies SelectOption[];

export const ids = studentFilterOptions.map((option) => option.id);

export type StudentFilterField = (typeof studentFilterOptions)[number]["id"];
