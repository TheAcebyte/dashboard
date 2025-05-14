import type { SessionStudentFilterField } from "@/constants/filters";
import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { sessionStudents, sessions } from "@/db/schema/sessions";
import { students } from "@/db/schema/students";
import { and, count, eq, like, or, sql } from "drizzle-orm";

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

export async function getSession(sessionId: string) {
  const [session] = await db
    .select({
      sessionId: sessions.sessionId,
      status: sessions.status,
      name: sessions.name,
      startedAt: sessions.startedAt,
      finishedAt: sessions.finishedAt,
      plannedDuration: sessions.plannedDuration,
      lateThreshold: sessions.lateThreshold,
    })
    .from(sessions)
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

export function findSessionById(sessionId: string) {
  return db.query.sessions.findFirst({
    where: eq(sessions.sessionId, sessionId),
  });
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

  const session = await getSession(activeSession.sessionId);
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

  const session = await getSession(activeSession.sessionId);
  return {
    found: true as const,
    session: session,
  };
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
    })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
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
    })
    .from(sessions)
    .innerJoin(
      sessionStudents,
      eq(sessionStudents.sessionId, sessions.sessionId),
    )
    .innerJoin(students, eq(students.studentId, sessionStudents.studentId))
    .where(
      and(
        eq(sessions.sessionId, sessionId),
        buildSessionStudentFilterCondition(filter),
      ),
    )
    .offset(offset)
    .limit(limit);
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

export type Session = Awaited<ReturnType<typeof getSession>>;

export type ActiveSessionResponse = Awaited<
  ReturnType<typeof findActiveSessionByGroupId>
>;

export type PaginatedSessionStudentRecord = Awaited<
  ReturnType<typeof findSessionStudentsWithPagination>
>[number];
