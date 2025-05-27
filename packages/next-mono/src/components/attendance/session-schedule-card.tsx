"use client";

import { Session } from "@/db/queries/sessions";
import { useLongDate } from "@/hooks/use-long-date";
import { formatDateToHHmm } from "@/lib/date";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

import EndSessionDialog from "./end-session-modal";

interface SessionScheduleProps {
  session: Session;
}

export default function SessionScheduleCard({ session }: SessionScheduleProps) {
  const t = useTranslations("attendance-page");
  const startDate = new Date(session.startedAt);
  let endDate: Date | null = null;
  if (session.finishedAt) {
    endDate = new Date(session.finishedAt);
  } else if (session.plannedDuration) {
    endDate = new Date(session.startedAt + session.plannedDuration);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-300 px-8 py-4">
      <header className="flex items-center gap-2 font-medium text-gray-500">
        <Calendar size={20} />
        <h1>{t("schedule")}</h1>
      </header>
      {endDate ? (
        <BoundedSchedule startDate={startDate} endDate={endDate} />
      ) : (
        <UnboundedSchedule startDate={startDate} />
      )}
      {!session.finishedAt && (
        <EndSessionDialog sessionId={session.sessionId} />
      )}
    </div>
  );
}

interface UnboundedScheduleProps {
  startDate: Date;
}

function UnboundedSchedule({ startDate }: UnboundedScheduleProps) {
  const startTime = formatDateToHHmm(startDate);
  const startDateLong = useLongDate(startDate);
  return (
    <div className="mt-4">
      <p className="text-[32px] font-semibold text-zinc-900">{startTime}</p>
      <p className="font-medium text-gray-500">{startDateLong}</p>
    </div>
  );
}

interface BoundedScheduleProps {
  startDate: Date;
  endDate: Date;
}

function BoundedSchedule({ startDate, endDate }: BoundedScheduleProps) {
  const startTime = formatDateToHHmm(startDate);
  const startDateLong = useLongDate(startDate);
  const endTime = formatDateToHHmm(endDate);
  const endDateLong = useLongDate(endDate);
  const isOnSameDay = startDateLong == endDateLong;

  if (isOnSameDay) {
    return (
      <div className="mt-4">
        <div className="text-[32px] font-semibold">
          <p className="inline text-zinc-900">{startTime}</p>
          <span className="text-gray-500"> - </span>
          <p className="inline text-zinc-900">{endTime}</p>
        </div>
        <p className="font-medium text-gray-500">{startDateLong}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-[32px] font-semibold text-zinc-900">{startTime}</p>
      <p className="font-medium text-gray-500">{startDateLong}</p>
      <p className="mt-4 text-[32px] font-semibold text-zinc-900">{endTime}</p>
      <p className="font-medium text-gray-500">{endDateLong}</p>
    </div>
  );
}
