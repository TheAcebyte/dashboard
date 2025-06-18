import DeleteStudentDialog from "@/components/database/students/delete-student-dialog";
import EditStudentDialog from "@/components/database/students/edit-student-dialog";
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
      <DropdownTrigger className="cursor-pointer text-primary-fg transition-colors hover:text-primary-hover-fg">
        <EllipsisVertical size={20} />
      </DropdownTrigger>
      <DropdownContent
        align="center"
        offsetY={8}
        className="rounded-xl border border-default-border bg-primary-bg"
      >
        <EditStudentDialog record={record} />
        <DeleteStudentDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
