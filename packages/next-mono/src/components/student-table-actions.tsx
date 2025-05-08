import DeleteStudentDialog from "@/components/delete-student-dialog";
import EditStudentDialog from "@/components/edit-student-dialog";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { PaginatedStudentRecord } from "@/db/queries/students";
import { EllipsisVertical } from "lucide-react";

interface Props {
  record: PaginatedStudentRecord;
}

export default function StudentTableActions({ record }: Props) {
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
        <EditStudentDialog record={record} />
        <DeleteStudentDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
