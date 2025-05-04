"use client";

import Avatar from "@/components/ui/avatar";
import {
  PaginationControl,
  PaginationStatus,
} from "@/components/ui/pagination";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cst } from "@/constants";
import { StudentFilterField } from "@/constants/filters";
import type { StudentColumns } from "@/db/schema/students";
import usePagination from "@/hooks/use-pagination";
import { getAge } from "@/lib/utils";
import { useStudentSearchStore } from "@/stores/student-search-store";
import { useEffect, useState } from "react";

const studentEndpoint = new URL("/api/students", cst.APP_URL);

export default function StudentTable() {
  const { searchField, searchTerm } = useStudentSearchStore();
  const [queryParameters, setQueryParameters] =
    useState<Partial<Record<StudentFilterField, string>>>();
  useEffect(() => {
    setQueryParameters({ [searchField]: searchTerm });
  }, [searchField, searchTerm]);

  const response = usePagination<StudentColumns>(
    studentEndpoint,
    5,
    queryParameters,
  );
  if (!response) return null;

  const { page, limit, count, total, data, gotoPage } = response;
  return (
    <div className="flex flex-col gap-12">
      <Table>
        <TableRow variant="header">
          <TableCell weight={2}>Name</TableCell>
          <TableCell weight={2}>CNE</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Group</TableCell>
        </TableRow>
        {data.map((entry, index) => {
          const fullName = `${entry.firstName} ${entry.lastName}`;
          const birthDate = new Date(entry.birthDate);
          const age = getAge(birthDate);

          return (
            <TableRow key={index}>
              <TableCell weight={2}>
                <div className="flex items-center gap-4">
                  <Avatar
                    src={entry.pictureUrl}
                    className="size-12 min-h-12 min-w-12"
                  />
                  <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {fullName}
                  </p>
                </div>
              </TableCell>
              <TableCell weight={2}>{entry.cne}</TableCell>
              <TableCell>{age}</TableCell>
              <TableCell>{entry.group}</TableCell>
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
