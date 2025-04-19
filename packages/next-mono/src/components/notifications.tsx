import Button from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <Button variant="outline" className="p-4">
      <Bell />
    </Button>
  );
}
