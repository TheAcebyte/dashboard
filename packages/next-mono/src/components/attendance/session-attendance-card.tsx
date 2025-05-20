import ProgressBar from "@/components/progress-bar";
import { Session } from "@/db/queries/sessions";
import { UsersRound } from "lucide-react";

interface Props {
  session: Session;
}

export default function SessionAttendanceCard({ session }: Props) {
  const presentStudentsCount =
    session.presentStudentsCount + session.lateStudentsCount;
  const nonExcusedStudentsCount =
    session.studentCount - session.excusedStudentsCount;
  const attendanceRate = Math.floor(
    (presentStudentsCount / nonExcusedStudentsCount) * 100,
  );

  return (
    <div className="rounded-2xl border border-gray-300 px-8 py-4">
      <header className="flex items-center gap-2 font-medium text-gray-500">
        <UsersRound size={20} />
        <h1>Attendants</h1>
      </header>
      <div className="mt-4 flex items-end">
        <span className="text-[32px] leading-8 font-semibold text-zinc-900">
          {presentStudentsCount}
        </span>
        <span className="text-xl font-semibold text-gray-400">
          /{nonExcusedStudentsCount}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex justify-between gap-8">
          <h2 className="font-medium text-zinc-900">Attendance Rate</h2>
          <p className="font-medium text-gray-500">{attendanceRate ?? 0} %</p>
        </div>
        <ProgressBar percentage={attendanceRate} />
      </div>
    </div>
  );
}
