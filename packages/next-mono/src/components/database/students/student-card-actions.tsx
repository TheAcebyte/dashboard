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

export default function StudentCardActions({ record }: Props) {
  return (
    <Dropdown className="absolute right-8 bottom-0 translate-y-1/2">
      <DropdownTrigger className="aspect-square cursor-pointer rounded-full border border-default-border bg-primary-bg p-2 text-primary-fg transition-colors hover:text-primary-hover-fg">
        <EllipsisVertical size={20} />
      </DropdownTrigger>
      <DropdownContent
        align="right"
        offsetY={8}
        className="rounded-xl border border-default-border bg-primary-bg"
      >
        <EditStudentDialog record={record} />
        <DeleteStudentDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
