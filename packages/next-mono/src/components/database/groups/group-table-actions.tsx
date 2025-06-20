import DeleteGroupDialog from "@/components/database/groups/delete-group-dialog";
import EditGroupDialog from "@/components/database/groups/edit-group-dialog";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { PaginatedGroupRecord } from "@/db/queries/groups";
import { EllipsisVertical } from "lucide-react";

interface Props {
  record: PaginatedGroupRecord;
}

export default function GroupTableActions({ record }: Props) {
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
        <EditGroupDialog record={record} />
        <DeleteGroupDialog record={record} />
      </DropdownContent>
    </Dropdown>
  );
}
