"use client";

import AddStudentDialog from "@/components/add-student-dialog";
import DatabaseTabSelector from "@/components/database-tab-selector";
import StudentSearchbar from "@/components/student-searchbar";
import StudentTable from "@/components/student-table";
import TableLayoutSelector from "@/components/table-layout-selector";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="students" />
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:gap-8">
        <StudentSearchbar className="flex-1" />
        <div className="flex justify-between gap-8">
          <TableLayoutSelector />
          <AddStudentDialog />
        </div>
      </div>
      <StudentTable />
    </div>
  );
}
