import AttendanceTabPanel from "@/components/attendance/attendance-tab-panel";
import SessionHistoryViewer from "@/components/attendance/session-history-viewer";
import { findAllGroups } from "@/db/queries/groups";

export default async function Page() {
  const groups = await findAllGroups();
  return (
    <div className="flex flex-1 flex-col gap-8">
      <AttendanceTabPanel selected="history" groups={groups} />
      <SessionHistoryViewer />
    </div>
  );
}
