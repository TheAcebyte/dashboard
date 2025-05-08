"use client";

import StudentTableActions from "@/components/student-table-actions";
import Avatar from "@/components/ui/avatar";
import {
  PaginationControl,
  PaginationStatus,
} from "@/components/ui/pagination";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cst } from "@/constants";
import { StudentFilterField } from "@/constants/filters";
import type { PaginatedStudentRecord } from "@/db/queries/students";
import usePagination from "@/hooks/use-pagination";
import { getAge } from "@/lib/utils";
import useStudentSearchStore from "@/stores/student-search-store";
import { useEffect, useState } from "react";

const studentEndpoint = new URL("/api/students", cst.APP_URL);

export default function StudentTable() {
  const { searchField, searchQuery } = useStudentSearchStore();
  const [queryParams, setQueryParams] =
    useState<Partial<Record<StudentFilterField, string>>>();
  useEffect(() => {
    setQueryParams({ [searchField]: searchQuery });
  }, [searchField, searchQuery]);

  const paginate = usePagination<PaginatedStudentRecord>(
    studentEndpoint,
    4,
    queryParams,
  );
  if (!paginate) return null;
  const { response, gotoPage } = paginate;
  const { page, limit, count, total, data } = response;

  return (
    <div className="flex flex-col gap-12">
      <Table>
        <TableRow variant="header">
          <TableCell weight={4}>Name</TableCell>
          <TableCell weight={3}>CNE</TableCell>
          <TableCell weight={2}>Age</TableCell>
          <TableCell weight={2}>Group</TableCell>
          <TableCell className="flex justify-center">Actions</TableCell>
        </TableRow>
        {data.map((record, index) => {
          const fullName = `${record.firstName} ${record.lastName}`;
          const birthDate = new Date(record.birthDate);
          const age = getAge(birthDate);

          return (
            <TableRow key={index}>
              <TableCell weight={4}>
                <div className="flex items-center gap-4">
                  <Avatar
                    src={record.pictureUrl}
                    className="size-12 min-h-12 min-w-12"
                  />
                  <p>{fullName}</p>
                </div>
              </TableCell>
              <TableCell weight={3}>{record.cne}</TableCell>
              <TableCell weight={2}>{age}</TableCell>
              <TableCell weight={2}>{record.group}</TableCell>
              <TableCell className="flex justify-center">
                <StudentTableActions record={record} />
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
      <div className="flex justify-between">
        <PaginationStatus
          page={page}
          limit={limit}
          count={count}
          total={total}
        />
        <PaginationControl
          page={page}
          limit={limit}
          total={total}
          gotoPage={gotoPage}
        />
      </div>
    </div>
  );
}
