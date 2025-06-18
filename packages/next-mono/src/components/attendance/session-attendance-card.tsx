import ProgressBar from "@/components/progress-bar";
import { Session } from "@/db/queries/sessions";
import { UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  session: Session;
}

export default function SessionAttendanceCard({ session }: Props) {
  const t = useTranslations("attendance-page");
  const presentStudentsCount =
    session.presentStudentsCount + session.lateStudentsCount;
  const nonExcusedStudentsCount =
    session.studentCount - session.excusedStudentsCount;
  const attendanceRate = Math.floor(
    (presentStudentsCount / nonExcusedStudentsCount) * 100,
  );

  return (
    <div className="rounded-2xl border border-default-border px-8 py-4">
      <header className="flex items-center gap-2 font-medium text-secondary-fg">
        <UsersRound size={20} />
        <h1>{t("attendants")}</h1>
      </header>
      <div className="mt-4 flex items-end">
        <span className="text-[32px] leading-8 font-semibold text-primary-fg">
          {presentStudentsCount}
        </span>
        <span className="text-xl font-semibold text-muted-fg">
          /{nonExcusedStudentsCount}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between gap-8">
          <h2 className="font-medium text-primary-fg">{t("attendance-rate")}</h2>
          <p className="font-medium text-secondary-fg">
            {isNaN(attendanceRate) ? 0 : attendanceRate} %
          </p>
        </div>
        <ProgressBar percentage={attendanceRate} />
      </div>
    </div>
  );
}
