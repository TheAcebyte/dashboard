import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { StudentStatus } from "@/constants/student-status";
import type { PaginatedSessionStudentRecord } from "@/db/queries/sessions";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const tagStyles = {
  present: "text-emerald-700 bg-emerald-50",
  absent: "text-red-700 bg-red-50",
  late: "text-orange-600 bg-orange-50",
  excused: "text-cyan-700 bg-cyan-50 hover:text-cyan-600",
} as const satisfies Record<StudentStatus, string>;

interface Props {
  record: PaginatedSessionStudentRecord;
  className?: string;
  children?: ReactNode;
}

export default function StudentStatusTag({
  record,
  className,
  children,
}: Props) {
  const status = record.status as StudentStatus;

  return status != "excused" ? (
    <p
      className={cn(
        "w-fit rounded-full px-2 text-sm font-medium transition-colors",
        tagStyles[status],
        className,
      )}
    >
      {children}
    </p>
  ) : (
    <Dropdown>
      <DropdownTrigger
        className={cn(
          "flex w-fit cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-medium",
          tagStyles[status],
          className,
        )}
      >
        Excused
      </DropdownTrigger>
      <DropdownContent
        offsetY={8}
        className="rounded-2xl border border-gray-300 bg-white px-4 py-2"
      >
        {record.excuse}
      </DropdownContent>
    </Dropdown>
  );
}
