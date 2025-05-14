"use client";

import GroupTableActions from "@/components/database/groups/group-table-actions";
import {
  PaginationControl,
  PaginationStatus,
} from "@/components/ui/pagination";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cst } from "@/constants";
import { GroupFilterField } from "@/constants/filters";
import { PaginatedGroupRecord } from "@/db/queries/groups";
import usePagination from "@/hooks/use-pagination";
import useGroupSearchStore from "@/stores/group-search-store";
import { useTableRefetchStore } from "@/stores/refetch-store";
import { useEffect, useState } from "react";

const groupEndpoint = new URL("/api/groups", cst.APP_URL);

export default function GroupTable() {
  const { searchField, searchQuery } = useGroupSearchStore();
  const [queryParams, setQueryParams] =
    useState<Partial<Record<GroupFilterField, string>>>();
  useEffect(() => {
    setQueryParams({ [searchField]: searchQuery });
  }, [searchField, searchQuery]);

  const { refetchCounter } = useTableRefetchStore();
  const paginate = usePagination<PaginatedGroupRecord>(groupEndpoint, 4, {
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
          <TableCell weight={3}>Name</TableCell>
          <TableCell weight={2}>Student Count</TableCell>
          <TableCell className="flex justify-center">Actions</TableCell>
        </TableRow>
        {data.map((record, index) => {
          return (
            <TableRow key={index} className="py-4">
              <TableCell weight={3}>{record.name}</TableCell>
              <TableCell weight={2}>{record.studentCount}</TableCell>
              <TableCell className="flex justify-center">
                <GroupTableActions record={record} />
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
