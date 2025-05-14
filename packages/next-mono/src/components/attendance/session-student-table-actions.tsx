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
          className="cursor-pointer text-zinc-900 transition-colors hover:text-zinc-700"
        />
      </DropdownTrigger>
      <DropdownContent
        align="center"
        offsetY={8}
        className="rounded-xl border border-gray-300 bg-white"
      >
        <ExcuseStudentDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
