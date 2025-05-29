import AddGroupDialog from "@/components/database/groups/add-group-dialog";
import DatabaseTabSelector from "@/components/database/database-tab-selector";
import GroupSearchbar from "@/components/database/groups/group-searchbar";
import GroupTable from "@/components/database/groups/group-table";

export default function Page() {
  return (
    <section className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="groups" />
      <div className="mb-4 flex gap-4 lg:gap-8">
        <GroupSearchbar className="flex-1" />
        <AddGroupDialog />
      </div>
      <GroupTable />
    </section>
  );
}
