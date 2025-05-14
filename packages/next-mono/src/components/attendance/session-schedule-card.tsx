"use client";

import { Session } from "@/db/queries/sessions";
import { formatDateToHHmm, formatDateToLong } from "@/lib/date";
import { Calendar } from "lucide-react";

import EndSessionDialog from "./end-session-modal";

interface SessionScheduleProps {
  session: Session;
}

export default function SessionScheduleCard({ session }: SessionScheduleProps) {
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
        <h1>Schedule</h1>
      </header>
      <Schedule startDate={startDate} endDate={endDate} />
      {!session.finishedAt && (
        <EndSessionDialog sessionId={session.sessionId} />
      )}
    </div>
  );
}

interface ScheduleProps {
  startDate: Date;
  endDate: Date | null;
}

function Schedule({ startDate, endDate }: ScheduleProps) {
  const startTime = formatDateToHHmm(startDate);
  const startDateLong = formatDateToLong(startDate);
  if (!endDate) {
    return (
      <div className="mt-4">
        <p className="text-[32px] font-semibold text-zinc-900">{startTime}</p>
        <p className="font-medium text-gray-500">{startDateLong}</p>
      </div>
    );
  }

  const endTime = formatDateToHHmm(endDate);
  const endDateLong = formatDateToLong(endDate);
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
