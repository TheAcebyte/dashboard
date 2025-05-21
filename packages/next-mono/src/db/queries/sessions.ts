import type {
  SessionFilterField,
  SessionStudentFilterField,
} from "@/constants/filters";
import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { sessionStudents, sessions } from "@/db/schema/sessions";
import { students } from "@/db/schema/students";
import { and, asc, count, desc, eq, gte, like, or, sql } from "drizzle-orm";

function buildSessionFilterCondition(
  filter: Partial<Record<SessionFilterField, string>>,
) {
  return and(
    filter.group ? eq(groups.name, filter.group) : undefined,
    filter.status ? eq(sessions.status, filter.status) : undefined,
  );
}

function buildSessionStudentFilterCondition(
  filter: Partial<Record<SessionStudentFilterField, string>>,
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
    filter.status
      ? like(sessionStudents.studentStatus, `${filter.status}%`)
      : undefined,
  );
}

export async function findSessionById(sessionId: string) {
  const [session] = await db
    .select({
      sessionId: sessions.sessionId,
      groupId: groups.groupId,
      groupName: groups.name,
      status: sessions.status,
      sessionName: sessions.name,
      startedAt: sessions.startedAt,
      finishedAt: sessions.finishedAt,
      plannedDuration: sessions.plannedDuration,
      lateThreshold: sessions.lateThreshold,
    })
    .from(sessions)
    .innerJoin(groups, eq(sessions.groupId, groups.groupId))
    .where(eq(sessions.sessionId, sessionId));

  const [stats] = await db
    .select({
      studentCount: count(),
      presentStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'present', 1, 0))`,
      absentStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'absent', 1, 0))`,
      lateStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'late', 1, 0))`,
      excusedStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'excused', 1, 0))`,
    })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .where(eq(sessions.sessionId, sessionId));

  return {
    ...session,
    studentCount: stats.studentCount ?? 0,
    presentStudentsCount: stats.presentStudentsCount ?? 0,
    absentStudentsCount: stats.absentStudentsCount ?? 0,
    lateStudentsCount: stats.lateStudentsCount ?? 0,
    excusedStudentsCount: stats.excusedStudentsCount ?? 0,
  };
}

export async function findStudentWithinSessionById(
  sessionId: string,
  studentId: string,
) {
  const [matchedStudent] = await db
    .select()
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessions.sessionId, sessionStudents.sessionId),
    )
    .where(
      and(
        eq(sessions.sessionId, sessionId),
        eq(sessionStudents.studentId, studentId),
      ),
    );

  return matchedStudent;
}

export async function findActiveSessionByGroupId(groupId: string) {
  const [activeSession] = await db
    .select({ sessionId: sessions.sessionId })
    .from(sessions)
    .where(and(eq(sessions.groupId, groupId), eq(sessions.status, "active")));
  if (!activeSession) {
    return { found: false as const };
  }

  const session = await findSessionById(activeSession.sessionId);
  return {
    found: true as const,
    session: session,
  };
}

export async function findActiveSessionByStudentId(studentId: string) {
  const [activeSession] = await db
    .select({ sessionId: sessions.sessionId })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .where(
      and(
        eq(sessionStudents.studentId, studentId),
        eq(sessions.status, "active"),
      ),
    );
  if (!activeSession) {
    return { found: false as const };
  }

  const session = await findSessionById(activeSession.sessionId);
  return {
    found: true as const,
    session: session,
  };
}

export async function findSessionsWithPagination(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const sessionIdList = await db
    .select({ sessionId: sessions.sessionId })
    .from(sessions)
    .orderBy(desc(sessions.startedAt))
    .limit(limit)
    .offset(offset);

  const sessionList = await Promise.all(
    sessionIdList.map(
      async ({ sessionId }) => await findSessionById(sessionId),
    ),
  );
  return sessionList;
}

export async function findSessionsWithFilteredPagination(
  filter: Partial<Record<SessionFilterField, string>>,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;
  const sessionIdList = await db
    .select({ sessionId: sessions.sessionId })
    .from(sessions)
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(buildSessionFilterCondition(filter))
    .orderBy(desc(sessions.startedAt))
    .limit(limit)
    .offset(offset);

  const sessionList = await Promise.all(
    sessionIdList.map(
      async ({ sessionId }) => await findSessionById(sessionId),
    ),
  );
  return sessionList;
}

export function findSessionStudentsWithPagination(
  sessionId: string,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;
  return db
    .select({
      sessionId: sessions.sessionId,
      studentId: students.studentId,
      firstName: students.firstName,
      lastName: students.lastName,
      pictureUrl: students.pictureUrl,
      status: sessionStudents.studentStatus,
      excuse: sessionStudents.studentExcuse,
      arrivedAt: sessionStudents.arrivedAt,
      groupId: groups.groupId,
      groupName: groups.name,
    })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(eq(sessions.sessionId, sessionId))
    .offset(offset)
    .limit(limit);
}

export function findSessionStudentsWithFilteredPagination(
  sessionId: string,
  filter: Partial<Record<SessionStudentFilterField, string>>,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;
  return db
    .select({
      sessionId: sessions.sessionId,
      studentId: students.studentId,
      firstName: students.firstName,
      lastName: students.lastName,
      pictureUrl: students.pictureUrl,
      status: sessionStudents.studentStatus,
      excuse: sessionStudents.studentExcuse,
      arrivedAt: sessionStudents.arrivedAt,
      groupId: groups.groupId,
      groupName: groups.name,
    })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(
      and(
        eq(sessions.sessionId, sessionId),
        buildSessionStudentFilterCondition(filter),
      ),
    )
    .offset(offset)
    .limit(limit);
}

export function findActiveStudentsSinceDateWithPagination(
  since: Date | number,
  page: number,
  limit: number,
) {
  since = since instanceof Date ? since.getDate() : since;
  const offset = (page - 1) * limit;
  return db
    .select({
      sessionId: sessions.sessionId,
      studentId: students.studentId,
      firstName: students.firstName,
      lastName: students.lastName,
      pictureUrl: students.pictureUrl,
      status: sessionStudents.studentStatus,
      arrivedAt: sessionStudents.arrivedAt,
      groupId: groups.groupId,
      groupName: groups.name,
    })
    .from(sessionStudents)
    .innerJoin(sessions, eq(sessions.sessionId, sessionStudents.sessionId))
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(
      and(
        gte(sessionStudents.arrivedAt, since),
        or(
          eq(sessionStudents.studentStatus, "present"),
          eq(sessionStudents.studentStatus, "late"),
        ),
      ),
    )
    .orderBy(asc(sessionStudents.arrivedAt))
    .offset(offset)
    .limit(limit);
}

export async function getSessionCount(sessionId: string) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(sessions)
    .where(eq(sessions.sessionId, sessionId));
  return totalCount;
}

export async function getSessionCountWithFilter(
  filter: Partial<Record<SessionFilterField, string>>,
) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(sessions)
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(buildSessionFilterCondition(filter));
  return totalCount;
}

export async function getSessionStudentCount(sessionId: string) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(sessionStudents)
    .where(eq(sessionStudents.sessionId, sessionId));
  return totalCount;
}

export async function getSessionStudentCountWithFilter(
  sessionId: string,
  filter: Partial<Record<SessionStudentFilterField, string>>,
) {
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(sessionStudents)
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .where(
      and(
        eq(sessionStudents.sessionId, sessionId),
        buildSessionStudentFilterCondition(filter),
      ),
    );
  return totalCount;
}

export async function getActiveStudentsSinceDateCount(since: Date | number) {
  since = since instanceof Date ? since.getDate() : since;
  const [{ count: totalCount }] = await db
    .select({
      count: count(),
    })
    .from(sessionStudents)
    .innerJoin(sessions, eq(sessions.sessionId, sessionStudents.sessionId))
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .innerJoin(groups, eq(groups.groupId, sessions.groupId))
    .where(
      and(
        gte(sessionStudents.arrivedAt, since),
        or(
          eq(sessionStudents.studentStatus, "present"),
          eq(sessionStudents.studentStatus, "late"),
        ),
      ),
    );

  return totalCount;
}

export type Session = Awaited<ReturnType<typeof findSessionById>>;

export type ActiveSessionResponse = Awaited<
  ReturnType<typeof findActiveSessionByGroupId>
>;

export type PaginatedSessionRecord = Awaited<
  ReturnType<typeof findSessionsWithPagination>
>[number];

export type PaginatedSessionStudentRecord = Awaited<
  ReturnType<typeof findSessionStudentsWithPagination>
>[number];

export type PaginatedActiveStudentRecord = Awaited<
  ReturnType<typeof findActiveStudentsSinceDateWithPagination>
>[number];
