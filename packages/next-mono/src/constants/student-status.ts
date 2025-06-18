import { SelectOption } from "@/components/ui/select";
import { capitalize } from "@/lib/utils";

export const studentStatus = ["present", "absent", "late", "excused"] as const;

export const studentStatusOptions = studentStatus.map((status) => ({
  id: status,
  label: capitalize(status),
})) satisfies SelectOption[];

export type StudentStatus = (typeof studentStatus)[number];
