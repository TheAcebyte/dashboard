import type { StudentFilterField } from "@/constants/filters";
import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { studentPictures, students } from "@/db/schema/students";
import { and, count, eq, like, or, sql } from "drizzle-orm";

function buildStudentFilterCondition(
  filter: Partial<Record<StudentFilterField, string>>,
) {
  return and(
    filter.name
      ? or(
          like(students.firstName, `${filter.name}%`),
          like(students.lastName, `${filter.name}%`),
          like(
            sql`${students.firstName} || ' ' || ${students.lastName}`,
            `${filter.name}%`,
          ),
        )
      : undefined,
    filter.cne ? like(students.cne, `${filter.cne}%`) : undefined,
    filter.age
      ? eq(
          sql`CAST (strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', ${students.birthDate} / 1000, 'unixepoch') AS INTEGER)`,
          filter.age,
        )
      : undefined,
    filter.group ? like(groups.name, `${filter.group}%`) : undefined,
  );
}

export function findStudentById(id: string) {
  return db.query.students.findFirst({ where: eq(students.studentId, id) });
}

export function findStudentByCNE(cne: string) {
  return db.query.students.findFirst({ where: eq(students.cne, cne) });
}

export function findStudentsWithPagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return db
    .select({
      studentId: students.studentId,
      firstName: students.firstName,
      lastName: students.lastName,
      cne: students.cne,
      birthDate: students.birthDate,
      groupId: groups.groupId,
      group: groups.name,
      pictureUrl: students.pictureUrl,
    })
    .from(students)
    .innerJoin(groups, eq(students.groupId, groups.groupId))
    .offset(offset)
    .limit(limit);
}

export function findStudentsWithFilteredPagination(
  filter: Partial<Record<StudentFilterField, string>>,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;
  return db
    .select({
      studentId: students.studentId,
      firstName: students.firstName,
      lastName: students.lastName,
      cne: students.cne,
      birthDate: students.birthDate,
      group: groups.name,
      pictureUrl: students.pictureUrl,
    })
    .from(students)
    .innerJoin(groups, eq(students.groupId, groups.groupId))
    .where(buildStudentFilterCondition(filter))
    .offset(offset)
    .limit(limit);
}

export function findStudentPictureById(id: string) {
  return db.query.studentPictures.findFirst({
    columns: { picture: true },
    where: eq(studentPictures.studentId, id),
  });
}

export async function getStudentCount() {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(students);
  return totalCount;
}

export async function getStudentCountWithFilter(
  filter: Partial<Record<StudentFilterField, string>>,
) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(students)
    .innerJoin(groups, eq(students.groupId, groups.groupId))
    .where(buildStudentFilterCondition(filter));
  return totalCount;
}

export type PaginatedStudentRecord = Awaited<
  ReturnType<typeof findStudentsWithPagination>
>[number];
