"use client";

import {
  PaginationControl,
  PaginationStatus,
} from "@/components/ui/pagination";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cst } from "@/constants";
import { StudentColumns } from "@/db/schema/students";
import usePagination from "@/hooks/use-pagination";
import { getAge } from "@/lib/utils";
import Image from "next/image";

const studentEndpoint = new URL("/api/students", cst.APP_URL);

export default function StudentTable() {
  const response = usePagination<StudentColumns>(studentEndpoint, 5);
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
                  <img
                    src={entry.pictureUrl}
                    className="size-12 rounded-full border border-gray-300 object-cover"
                  />
                  <p>{fullName}</p>
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
