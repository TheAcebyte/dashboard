import { db } from "@/db";
import { groups } from "@/db/schema/groups";
import { sessionStudents, sessions } from "@/db/schema/sessions";
import { and, eq, or, sql } from "drizzle-orm";

export async function findActiveSession(groupIdOrName: string) {
  const [activeSession] = await db
    .select({
      sessionId: sessions.sessionId,
      sessionName: sessions.name,
      startedAt: sessions.startedAt,
      finishedAt: sessions.finishedAt,
      plannedDuration: sessions.plannedDuration,
      lateThreshold: sessions.lateThreshold,
      presentStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'present', 1, 0))`,
      absentStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'absent', 1, 0))`,
      lateStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'late', 1, 0))`,
      excusedStudentsCount: sql<number>`SUM(IIF(${sessionStudents.studentStatus} = 'excused', 1, 0))`,
    })
    .from(sessions)
    .innerJoin(groups, eq(sessions.groupId, groups.groupId))
    .innerJoin(
      sessionStudents,
      eq(sessions.sessionId, sessionStudents.sessionId),
    )
    .groupBy(sessions.sessionId)
    .where(
      and(
        or(eq(groups.groupId, groupIdOrName), eq(groups.name, groupIdOrName)),
        eq(sessions.status, "active"),
      ),
    );

  if (!activeSession) {
    return { found: false as const };
  }

  return {
    found: true as const,
    session: activeSession,
  };
}
