import SessionAttendanceCard from "@/components/attendance/session-attendance-card";
import SessionScheduleCard from "@/components/attendance/session-schedule-card";
import SessionTimerCard from "@/components/attendance/session-timer-card";
import { Session } from "@/db/queries/sessions";

interface Props {
  session: Session;
}

export default function SessionCardList({ session }: Props) {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <SessionAttendanceCard session={session} />
      {session.plannedDuration && !session.finishedAt && (
        <SessionTimerCard
          sessionId={session.sessionId}
          startedAt={session.startedAt}
          plannedDuration={session.plannedDuration}
        />
      )}
      <SessionScheduleCard session={session} />
    </div>
  );
}
