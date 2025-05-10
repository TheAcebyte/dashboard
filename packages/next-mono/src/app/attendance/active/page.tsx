import AttendanceTabPanel from "@/components/attendance/attendance-tab-panel";
import { buttonStyles } from "@/components/ui/button";
import { findAllGroups } from "@/db/queries/groups";
import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const groups = await findAllGroups();
  const noGroupsFound = groups.length == 0;

  return (
    <div className="mt-16 flex flex-col gap-8">
      <AttendanceTabPanel selected="active" groups={groups} />
      {noGroupsFound ? <NoGroupState /> : null}
    </div>
  );
}

export function NoGroupState() {
  return (
    <div className="mx-auto mt-32 flex w-[400px] flex-col items-center">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <UsersRound size={24} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        No Groups Found
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        Create your first group to view attendance.
      </p>
      <Link
        href="/database/groups"
        className={cn(buttonStyles.solid, "mt-8 px-8")}
      >
        Move to Groups
      </Link>
    </div>
  );
}
