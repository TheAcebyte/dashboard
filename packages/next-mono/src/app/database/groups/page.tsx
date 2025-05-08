import AddGroupDialog from "@/components/add-group-dialog";
import DatabaseTabSelector from "@/components/database-tab-selector";
import GroupSearchbar from "@/components/group-searchbar";
import GroupTable from "@/components/group-table";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="groups" />
      <div className="mb-4 flex gap-4 lg:gap-8">
        <GroupSearchbar className="flex-1" />
        <AddGroupDialog />
      </div>
      <GroupTable />
    </div>
  );
}
