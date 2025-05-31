import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { StudentStatus } from "@/constants/student-status";
import type { PaginatedSessionStudentRecord } from "@/db/queries/sessions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const tagStyles = {
  present: "text-status-success-fg bg-status-success-bg",
  absent: "text-destructive-fg bg-destructive-bg",
  late: "text-status-warning-fg bg-status-warning-bg",
  excused: "text-status-info-fg bg-status-info-bg hover:text-cyan-600",
} as const satisfies Record<StudentStatus, string>;

interface Props {
  record: PaginatedSessionStudentRecord;
  className?: string;
}

export default function StudentStatusTag({
  record,
  className,
}: Props) {
  const t = useTranslations("attendance-page");
  const status = record.status as StudentStatus;

  if (status != "excused") {
    return (
      <p
        className={cn(
          "w-fit rounded-full px-2 text-sm font-medium transition-colors",
          tagStyles[status],
          className,
        )}
      >
        {t(`status-${status}`)}
      </p>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger
        className={cn(
          "flex w-fit cursor-pointer items-center gap-2 rounded-full px-2 text-sm font-medium",
          tagStyles[status],
          className,
        )}
      >
        {t("status-excused")}
      </DropdownTrigger>
      <DropdownContent
        offsetY={8}
        className="rounded-2xl border border-default-border bg-primary-bg px-4 py-2"
      >
        {record.excuse}
      </DropdownContent>
    </Dropdown>
  );
}
