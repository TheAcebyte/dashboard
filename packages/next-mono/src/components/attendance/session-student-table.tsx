"use client";

import SessionStudentTableActions from "@/components/attendance/session-student-table-actions";
import StudentStatusTag from "@/components/attendance/student-status-tag";
import Avatar from "@/components/ui/avatar";
import {
  PaginationControl,
  PaginationStatus,
} from "@/components/ui/pagination";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cst } from "@/constants";
import type { SessionStudentFilterField } from "@/constants/filters";
import type { StudentStatus } from "@/constants/student-status";
import type {
  PaginatedSessionStudentRecord,
  Session,
} from "@/db/queries/sessions";
import usePagination from "@/hooks/use-pagination";
import { formatDateToHHmm } from "@/lib/date";
import { capitalize } from "@/lib/utils";
import { useSessionRefetchStore } from "@/stores/refetch-store";
import useStudentSearchStore from "@/stores/student-search-store";
import { useEffect, useState } from "react";

interface Props {
  session: Session;
}

export default function SessionStudentTable({ session }: Props) {
  const endpoint = new URL(
    `/api/sessions/${session.sessionId}/students`,
    cst.APP_URL,
  );
  const { searchField, searchQuery } = useStudentSearchStore();
  const [queryParams, setQueryParams] =
    useState<Partial<Record<SessionStudentFilterField, string>>>();
  useEffect(() => {
    setQueryParams({ [searchField]: searchQuery });
  }, [searchField, searchQuery]);
  const { refetchCounter } = useSessionRefetchStore();

  const paginate = usePagination<PaginatedSessionStudentRecord>(endpoint, 4, {
    queryParams,
    refetchCounter,
  });

  if (!paginate) return null;
  const { response, gotoPage } = paginate;
  const { page, limit, count, total, data } = response;

  return (
    <div className="flex flex-col gap-12">
      <Table>
        <TableRow variant="header">
          <TableCell weight={4}>Name</TableCell>
          <TableCell weight={3}>Status</TableCell>
          <TableCell weight={2}>Arrival Time</TableCell>
          <TableCell className="flex justify-center">Actions</TableCell>
        </TableRow>
        {data.map((record, index) => {
          const fullName = `${record.firstName} ${record.lastName}`;
          const status = record.status as StudentStatus;
          const arrivedAt = record.arrivedAt
            ? formatDateToHHmm(new Date(record.arrivedAt))
            : null;

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
              <TableCell weight={3}>
                <StudentStatusTag record={record}>
                  {capitalize(status)}
                </StudentStatusTag>
              </TableCell>
              <TableCell weight={2}>{arrivedAt}</TableCell>
              <TableCell className="flex justify-center">
                <SessionStudentTableActions record={record} />
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
