import DatabaseTabSelector from "@/components/database-tab-selector";
import StudentSearchbar from "@/components/student-searchbar";
import TableLayoutSelector from "@/components/table-layout-selector";
import Button from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <div className="mt-16 flex flex-col gap-8">
      <DatabaseTabSelector selected="students" />
      <div className="flex gap-8">
        <StudentSearchbar className="flex-1" />
        <TableLayoutSelector initialLayout="list" />
        <Button variant="solid" className="flex items-center gap-2">
          Add
          <Plus />
        </Button>
      </div>
    </div>
  );
}
