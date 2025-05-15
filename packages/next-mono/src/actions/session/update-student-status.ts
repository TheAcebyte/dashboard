"use server";

import { db } from "@/db";
import {
  findSessionById,
  findStudentWithinSessionById,
} from "@/db/queries/sessions";
import { sessionStudents } from "@/db/schema/sessions";
import { and, eq } from "drizzle-orm";

export default async function updateStudentStatus(
  sessionId: string,
  studentId: string,
) {
  const matchedStudent = await findStudentWithinSessionById(
    sessionId,
    studentId,
  );
  if (!matchedStudent) {
    return {
      success: false,
      message: "Could not find student within session.",
    };
  }

  const session = await findSessionById(sessionId);
  const arrivedAt = Date.now();
  const status =
    session.lateThreshold &&
    arrivedAt > session.startedAt + session.lateThreshold
      ? "late"
      : "present";

  await db
    .update(sessionStudents)
    .set({ studentStatus: status, arrivedAt: arrivedAt })
    .where(
      and(
        eq(sessionStudents.sessionId, sessionId),
        eq(sessionStudents.studentId, studentId),
      ),
    );

  return {
    success: true,
    message: "Successfully updated student status.",
  };
}
