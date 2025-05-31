import Avatar from "@/components/ui/avatar";
import { PaginatedActiveStudentRecord } from "@/db/queries/sessions";
import { useRelativeDate } from "@/hooks/use-relative-date";
import { useTranslations } from "next-intl";

interface Props {
  student: PaginatedActiveStudentRecord;
  unseen?: boolean;
  refreshCounter?: number;
}

export default function NotificationEntry({ student, unseen = true }: Props) {
  const t = useTranslations("notifications");
  const fullName = `${student.firstName} ${student.lastName}`;
  // Since status is either present or late, arrivedAt is guaranteed to exist
  const arrivalDate = new Date(student.arrivedAt!);
  const formattedDate = useRelativeDate(arrivalDate);

  return (
    <div className="flex w-full items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <Avatar src={student.pictureUrl} size={48} />
        <div className="flex flex-col">
          <p className="text-primary-fg">
            <span className="font-medium">{fullName}</span>{" "}
            {t("checked-in-for")}{" "}
            <span className="font-medium">{student.groupName}.</span>
          </p>
          <p className="text-sm font-medium text-secondary-fg">{formattedDate}</p>
        </div>
      </div>
      {unseen && <div className="size-2 rounded-full bg-destructive-fg" />}
    </div>
  );
}
