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
import { useSessionRefetchStore } from "@/stores/refetch-store";
import useSessionStudentSearchStore from "@/stores/session-student-search-store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface Props {
  session: Session;
}

export default function SessionStudentTable({ session }: Props) {
  const t = useTranslations("attendance-page");
  const endpoint = new URL(
    `/api/sessions/${session.sessionId}/students`,
    cst.APP_URL,
  );

  const { searchField, searchQuery } = useSessionStudentSearchStore();
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
          <TableCell weight={4}>{t("student-column-name")}</TableCell>
          <TableCell weight={3}>{t("student-column-status")}</TableCell>
          <TableCell weight={2}>{t("student-column-arrival-time")}</TableCell>
          <TableCell className="flex justify-center">
            {t("student-column-actions")}
          </TableCell>
        </TableRow>
        {data.map((record, index) => {
          const fullName = `${record.firstName} ${record.lastName}`;
          const arrivedAt = record.arrivedAt
            ? formatDateToHHmm(new Date(record.arrivedAt))
            : null;

          return (
            <TableRow key={index}>
              <TableCell weight={4}>
                <div className="flex items-center gap-4">
                  <Avatar src={record.pictureUrl} size={48} />
                  <p>{fullName}</p>
                </div>
              </TableCell>
              <TableCell weight={3}>
                <StudentStatusTag record={record} />
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
