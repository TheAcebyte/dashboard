import StudentCardActions from "@/components/database/students/student-card-actions";
import Avatar from "@/components/ui/avatar";
import { cst } from "@/constants";
import { PaginatedStudentRecord } from "@/db/queries/students";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const displayClassmatesThreshold = 5;
const studentCardListUrl = new URL("/database/students?view=card", cst.APP_URL);

interface Props {
  record: PaginatedStudentRecord;
  classmates: PaginatedStudentRecord[];
  remaining: number;
}

export default function StudentCard({ record, classmates, remaining }: Props) {
  const t = useTranslations("database-page");
  const fullName = `${record.firstName} ${record.lastName}`;
  const classmatesUrl = new URL(studentCardListUrl);
  classmatesUrl.searchParams.set("field", "group");
  classmatesUrl.searchParams.set("query", record.group);

  return (
    <div className="border-default-border bg-primary-bg w-[300px] rounded-2xl border">
      <div className="bg-placeholder-bg relative h-[80px] rounded-tl-2xl rounded-tr-2xl">
        <Avatar
          src={record.pictureUrl}
          size={100}
          className="border-primary-bg absolute bottom-0 left-8 translate-y-1/2 border-3"
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
          <h2 className="text-secondary-fg font-medium">
            {t("student-column-name")}
          </h2>
          <p className="text-primary-fg font-medium">{fullName}</p>
          <h2 className="text-secondary-fg font-medium">
            {t("student-column-cne")}
          </h2>
          <p className="text-primary-fg font-medium">{record.cne}</p>
          <h2 className="text-secondary-fg font-medium">
            {t("student-column-group")}
          </h2>
          <p className="text-primary-fg font-medium">{record.group}</p>
        </div>
        {classmates.length >= displayClassmatesThreshold && (
          <div className="flex flex-col gap-4">
            <h2 className="text-primary-fg font-medium">
              {t("student-column-classmates")}
            </h2>
            <div className="flex items-center gap-2">
              <ul className="flex">
                {classmates.map((classmate, index) => (
                  <li key={index} style={{ translate: `${-10 * index}px` }}>
                    <Avatar
                      src={classmate.pictureUrl}
                      size={40}
                      className="border-primary-bg bg-primary-bg border-2"
                    />
                  </li>
                ))}
              </ul>
              {remaining > 0 && (
                <Link
                  href={classmatesUrl}
                  className="text-accent-fg hover:text-accent-hover-fg font-medium"
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
