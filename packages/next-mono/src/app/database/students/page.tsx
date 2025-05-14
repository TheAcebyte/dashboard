import DataLayoutSelector from "@/components/database/data-layout-selector";
import DatabaseTabSelector from "@/components/database/database-tab-selector";
import AddStudentDialog from "@/components/database/students/add-student-dialog";
import StudentDataView from "@/components/database/students/student-data-view";
import StudentSearchbar from "@/components/database/students/student-searchbar";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="students" />
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:gap-8">
        <StudentSearchbar />
        <div className="flex justify-between gap-8">
          <DataLayoutSelector />
          <AddStudentDialog />
        </div>
      </div>
      <StudentDataView />
    </div>
  );
}
