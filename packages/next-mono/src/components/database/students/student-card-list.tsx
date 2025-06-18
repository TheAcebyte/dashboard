"use client";

import StudentCard from "@/components/database/students/student-card";
import Spinner from "@/components/spinner";
import { env } from "@/constants/env";
import type { StudentFilterField } from "@/constants/filters";
import type { PaginatedStudentRecord } from "@/db/queries/students";
import useInfinitePagination from "@/hooks/use-infinite-pagination";
import { fetchGroupOptions, fetchStudentsFromGroup } from "@/lib/fetch";
import { useTableRefetchStore } from "@/stores/refetch-store";
import useStudentSearchStore from "@/stores/student-search-store";
import { useEffect, useRef, useState } from "react";

const maxShownClassmates = 4;
const studentEndpoint = new URL("/api/students", env.APP_URL);

type GroupStudents = Record<
  string,
  { total: number; students: PaginatedStudentRecord[] }
>;

export default function StudentCardList() {
  const { searchField, searchQuery } = useStudentSearchStore();
  const [queryParams, setQueryParams] =
    useState<Partial<Record<StudentFilterField, string>>>();
  useEffect(() => {
    setQueryParams({ [searchField]: searchQuery });
  }, [searchField, searchQuery]);

  const { refetchCounter } = useTableRefetchStore();
  const paginate = useInfinitePagination<PaginatedStudentRecord>(
    studentEndpoint,
    10,
    { queryParams, refetchCounter },
  );
  const spinnerRef = useRef<HTMLDivElement>(null);
  const countDependency = paginate?.response.count;

  useEffect(() => {
    if (!spinnerRef.current) return;
    const spinner = spinnerRef.current;

    const observer = new IntersectionObserver((entries) => {
      const [spinnerEntry] = entries;
      if (spinnerEntry.isIntersecting) {
        loadMore();
        observer.unobserve(spinner);
      }
    });

    observer.observe(spinner);
    return () => observer.unobserve(spinner);
  }, [countDependency]);

  const [groupStudents, setGroupStudents] = useState<GroupStudents>({});
  const dataDependency = paginate?.response.data;

  useEffect(() => {
    const fillGroups = async () => {
      const groupOptions = await fetchGroupOptions();
      groupOptions.forEach(async ({ label: group }) => {
        const groupData = await fetchStudentsFromGroup(
          group,
          maxShownClassmates + 1,
        );
        setGroupStudents((groupStudents) => ({
          ...groupStudents,
          [group]: groupData,
        }));
      });
    };

    fillGroups();
  }, [dataDependency]);

  if (!paginate) return null;
  const { response, loadMore } = paginate;
  const { data, remaining } = response;

  return (
    <div className="w-full">
      <ul className="flex flex-wrap gap-8">
        {data.map((record) => {
          const getClassmates = (): {
            remaining: number;
            classmates: PaginatedStudentRecord[];
          } => {
            if (!groupStudents.hasOwnProperty(record.group)) {
              return { remaining: 0, classmates: [] };
            }

            const { total, students } = groupStudents[record.group];
            const classmates = students.filter(
              (student) => student.studentId != record.studentId,
            );
            if (classmates.length > maxShownClassmates) classmates.pop();
            const remaining = total - classmates.length - 1;
            return { remaining, classmates };
          };

          const { remaining, classmates } = getClassmates();
          return (
            <li key={record.studentId}>
              <StudentCard
                record={record}
                classmates={classmates}
                remaining={remaining}
              />
            </li>
          );
        })}
      </ul>
      {remaining > 0 && (
        <Spinner
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          ref={spinnerRef}
        />
      )}
    </div>
  );
}
