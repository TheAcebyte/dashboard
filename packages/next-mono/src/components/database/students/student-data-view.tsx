"use client";

import StudentCardList from "@/components/database/students/student-card-list";
import StudentTable from "@/components/database/students/student-table";
import useDataLayoutStore from "@/stores/data-layout-store";

export default function StudentDataView() {
  const { dataLayout } = useDataLayoutStore();
  return dataLayout == "table" ? <StudentTable /> : <StudentCardList />;
}
