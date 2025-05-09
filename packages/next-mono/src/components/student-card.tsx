import StudentCardActions from "@/components/student-card-actions";
import Avatar from "@/components/ui/avatar";
import { cst } from "@/constants";
import { PaginatedStudentRecord } from "@/db/queries/students";
import Link from "next/link";

const displayClassmatesThreshold = 2;
const studentCardListUrl = new URL("/database/students?view=card", cst.APP_URL);

interface Props {
  record: PaginatedStudentRecord;
  classmates: PaginatedStudentRecord[];
  remaining: number;
}

export default function StudentCard({ record, classmates, remaining }: Props) {
  const fullName = `${record.firstName} ${record.lastName}`;
  const classmatesUrl = new URL(studentCardListUrl);
  classmatesUrl.searchParams.set("field", "group");
  classmatesUrl.searchParams.set("query", record.group);

  return (
    <div className="w-[300px] rounded-2xl border border-gray-300 bg-white">
      <div className="relative h-[80px] rounded-2xl bg-gray-100">
        <Avatar
          src={record.pictureUrl}
          className="absolute bottom-0 left-8 size-[100px] min-h-[100px] min-w-[100px] translate-y-1/2 border-3 border-white"
        />
        <StudentCardActions record={record} />
      </div>
      <div className="mt-10 flex flex-col gap-8 p-8">
        <div
          className="gap-4"
          style={{
            display: "grid",
            gridTemplateColumns: "max-content max-content",
          }}
        >
          <h2 className="font-medium text-gray-500">Name</h2>
          <p className="font-medium text-zinc-900">{fullName}</p>
          <h2 className="font-medium text-gray-500">CNE</h2>
          <p className="font-medium text-zinc-900">{record.cne}</p>
          <h2 className="font-medium text-gray-500">Group</h2>
          <p className="font-medium text-zinc-900">{record.group}</p>
        </div>
        {classmates.length >= displayClassmatesThreshold && (
          <div className="flex flex-col gap-4">
            <h2 className="font-medium text-zinc-900">Classmates</h2>
            <div className="flex items-center gap-2">
              <ul className="flex">
                {classmates.map((classmate, index) => (
                  <li key={index} style={{ translate: `${-10 * index}px` }}>
                    <Avatar
                      src={classmate.pictureUrl}
                      size={40}
                      className="border-2 border-white bg-white"
                    />
                  </li>
                ))}
              </ul>
              {remaining > 0 && (
                <Link
                  href={classmatesUrl}
                  className="font-medium text-green-700 hover:text-green-600"
                  style={{ translate: `${-10 * (classmates.length - 1)}px` }}
                >
                  +{remaining} more
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
