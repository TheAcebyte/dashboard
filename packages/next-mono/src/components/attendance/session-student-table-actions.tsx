import ExcuseStudentDialog from "@/components/attendance/excuse-student-dialog";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { PaginatedSessionStudentRecord } from "@/db/queries/sessions";
import { EllipsisVertical } from "lucide-react";

interface Props {
  record: PaginatedSessionStudentRecord;
}

export default function SessionStudentTableActions({ record }: Props) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <EllipsisVertical
          size={20}
          className="cursor-pointer text-primary-fg transition-colors hover:text-primary-hover-fg"
        />
      </DropdownTrigger>
      <DropdownContent
        align="center"
        offsetY={8}
        className="rounded-xl border border-default-border bg-primary-bg"
      >
        <ExcuseStudentDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
