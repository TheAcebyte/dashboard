import { GroupFilterField } from "@/constants/filters";
import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { students } from "@/db/schema/students";
import { count, eq, like } from "drizzle-orm";

function buildGroupFilterCondition(
  filter: Partial<Record<GroupFilterField, string>>,
) {
  return filter.name ? like(groups.name, `${filter.name}%`) : undefined;
}

export function findGroupById(id: string) {
  return db.query.groups.findFirst({ where: eq(groups.groupId, id) });
}

export function findGroupByName(name: string) {
  return db.query.groups.findFirst({ where: eq(groups.name, name) });
}

export function findGroupsWithPagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return db
    .select({
      groupId: groups.groupId,
      name: groups.name,
      studentCount: count(students.studentId),
    })
    .from(groups)
    .leftJoin(students, eq(groups.groupId, students.groupId))
    .groupBy(groups.groupId)
    .offset(offset)
    .limit(limit);
}

export function findGroupsWithFilteredPagination(
  filter: Partial<Record<GroupFilterField, string>>,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;
  return db
    .select({
      groupId: groups.groupId,
      name: groups.name,
      studentCount: count(students.studentId),
    })
    .from(groups)
    .leftJoin(students, eq(groups.groupId, students.groupId))
    .groupBy(groups.groupId)
    .where(buildGroupFilterCondition(filter))
    .offset(offset)
    .limit(limit);
}

export async function getGroupCount() {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(groups);
  return totalCount;
}

export async function getGroupCountWithFilter(
  filter: Partial<Record<GroupFilterField, string>>,
) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(groups)
    .where(buildGroupFilterCondition(filter));
  return totalCount;
}

export type PaginatedGroupRecord = Awaited<
  ReturnType<typeof findGroupsWithPagination>
>[number];
