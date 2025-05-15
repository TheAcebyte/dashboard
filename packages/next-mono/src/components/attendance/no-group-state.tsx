import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UsersRound } from "lucide-react";
import Link from "next/link";

export default function NoGroupState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <UsersRound size={24} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">
        No Groups Found
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        Create your first group to view attendance.
      </p>
      <Link
        href="/database/groups"
        className={cn(buttonStyles.solid, "mt-8 px-8")}
      >
        Move to Groups
      </Link>
    </div>
  );
}
