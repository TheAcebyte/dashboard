import ActiveSessionViewer from "@/components/attendance/active-session-viewer";
import AttendanceTabPanel from "@/components/attendance/attendance-tab-panel";
import NoGroupState from "@/components/attendance/no-group-state";
import { findAllGroups } from "@/db/queries/groups";

export default async function Page() {
  const groups = await findAllGroups();
  const noGroupsFound = groups.length == 0;

  return (
    <section className="flex flex-1 flex-col gap-8">
      <AttendanceTabPanel selected="active" groups={groups} />
      {noGroupsFound ? <NoGroupState /> : <ActiveSessionViewer />}
    </section>
  );
}
