"use client";

import SessionCardList from "@/components/attendance/session-card-list";
import SessionStudentSearchbar from "@/components/attendance/session-student-searchbar";
import SessionStudentTable from "@/components/attendance/session-student-table";
import StartSessionDialog from "@/components/attendance/start-session-dialog";
import { buttonStyles } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import usePolling from "@/hooks/use-polling";
import { fetchActiveSessionByGroupName } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import useAttendanceGroupStore from "@/stores/attendance-group-store";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

const pollingDelay = 5000;

export default function ActiveSessionViewer() {
  const { group } = useAttendanceGroupStore();
  const fetchActiveSession = useCallback(() => {
    return fetchActiveSessionByGroupName(group);
  }, [group]);
  const { refetchCounter, refetch } = useSessionRefetchStore();
  const { data } = useFetch(fetchActiveSession, {
    refetchCounter,
  });
  usePolling(refetch, pollingDelay);

  if (!data) return null;
  if (!data.found) return <NoActiveSessionState group={group} />;
  return (
    <div>
      <SessionCardList session={data.session} />
      <h1 className="mt-16 mb-4 text-2xl font-semibold text-zinc-900">
        Students
      </h1>
      <div className="flex flex-col gap-8">
        <SessionStudentSearchbar />
        <SessionStudentTable session={data.session} />
      </div>
    </div>
  );
}

interface Props {
  group: string;
}

function NoActiveSessionState({ group }: Props) {
  const searchParams = new URLSearchParams({ group });
  const sessionHistoryRoute = "/attendance/history?" + searchParams.toString();

  return (
    <div className="flex flex-col justify-center flex-1 items-center">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <Pencil size={24} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        No Active Session
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        Start a session to track attendance.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href={sessionHistoryRoute}
          className={cn(buttonStyles.outline, "px-8")}
        >
          View History
        </Link>
        <StartSessionDialog />
      </div>
    </div>
  );
}
