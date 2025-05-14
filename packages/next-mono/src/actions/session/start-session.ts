"use server";

import { SessionFields, sessionSchema } from "@/actions/session/validation";
import { db } from "@/db";
import { findGroupByName } from "@/db/queries/groups";
import { sessionStudents, sessions } from "@/db/schema/sessions";
import { students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export default async function startSession(
  payload: SessionFields,
): Promise<ServerActionResponse> {
  const parseResult = sessionSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  const matchedGroup = await findGroupByName(payload.group);
  if (!matchedGroup) {
    return { success: false, message: "Could not find session." };
  }

  const sessionId = randomUUID();
  const { groupId } = matchedGroup;
  const startedAt = Date.now();
  const durationInMs = payload.duration
    ? payload.duration * 60 * 1000
    : undefined;
  const lateThresholdInMs = payload.lateThreshold
    ? payload.lateThreshold * 60 * 1000
    : undefined;

  await db.insert(sessions).values({
    sessionId: sessionId,
    groupId: groupId,
    status: "active",
    name: payload.name,
    startedAt: startedAt,
    plannedDuration: durationInMs,
    lateThreshold: lateThresholdInMs,
  });

  // Pre-populating the session_students junction table
  const studentsFromGroup = await db
    .select({ studentId: students.studentId })
    .from(students)
    .where(eq(students.groupId, groupId));

  if (studentsFromGroup.length != 0) {
    await db.insert(sessionStudents).values(
      studentsFromGroup.map(({ studentId }) => ({
        sessionId: sessionId,
        studentId: studentId,
        studentStatus: "absent",
      })),
    );
  }

  return { success: true, message: "Successfully started session." };
}
