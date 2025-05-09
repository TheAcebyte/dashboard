import AddStudentDialog from "@/components/add-student-dialog";
import DataLayoutSelector from "@/components/data-layout-selector";
import DatabaseTabSelector from "@/components/database-tab-selector";
import StudentDataView from "@/components/student-data-view";
import StudentSearchbar from "@/components/student-searchbar";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="students" />
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:gap-8">
        <StudentSearchbar className="flex-1" />
        <div className="flex justify-between gap-8">
          <DataLayoutSelector />
          <AddStudentDialog />
        </div>
      </div>
      <StudentDataView />
    </div>
  );
}
