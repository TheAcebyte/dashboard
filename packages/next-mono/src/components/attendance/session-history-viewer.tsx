"use client";

import SessionCardList from "@/components/attendance/session-card-list";
import SessionHistoryGraph from "@/components/attendance/session-history-graph";
import SessionStudentSearchbar from "@/components/attendance/session-student-searchbar";
import SessionStudentTable from "@/components/attendance/session-student-table";
import useFetch from "@/hooks/use-fetch";
import { fetchSessionById } from "@/lib/fetch";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { useSelectedSessionStore } from "@/stores/selected-session-store";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export default function SessionHistoryViewer() {
  return (
    <div className="flex w-full flex-col gap-16">
      <SessionHistoryGraph />
      <SelectedSessionDetails />
    </div>
  );
}

function SelectedSessionDetails() {
  const t = useTranslations("attendance-page");
  const { sessionId } = useSelectedSessionStore();
  const fetchSelectedSession = useCallback(async () => {
    if (!sessionId) return null;
    return fetchSessionById(sessionId);
  }, [sessionId]);
  const { refetchCounter } = useSessionRefetchStore();
  const { data } = useFetch(fetchSelectedSession, { refetchCounter });

  if (!sessionId || !data) return;
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900">
        {t("session")}
      </h1>
      <SessionCardList session={data} />
      <h1 className="mt-16 mb-4 text-2xl font-semibold text-zinc-900">
        {t("students")}
      </h1>
      <div className="flex flex-col gap-8">
        <SessionStudentSearchbar />
        <SessionStudentTable session={data} />
      </div>
    </div>
  );
}
