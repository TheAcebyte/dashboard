"use client";

import StudentCardList from "@/components/student-card-list";
import StudentTable from "@/components/student-table";
import useDataLayoutStore from "@/stores/data-layout-store";

export default function StudentDataView() {
  const { dataLayout } = useDataLayoutStore();
  return dataLayout == "table" ? <StudentTable /> : <StudentCardList />;
}
