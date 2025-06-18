"use server";

import { db } from "@/db";
import {
  findSessionById,
  findStudentWithinSessionById,
} from "@/db/queries/sessions";
import { sessionStudents } from "@/db/schema/sessions";
import { and, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function updateStudentStatus(
  sessionId: string,
  studentId: string,
) {
  const t = await getTranslations("attendance-page");
  const matchedStudent = await findStudentWithinSessionById(
    sessionId,
    studentId,
  );
  if (!matchedStudent) {
    return {
      success: false,
      message: t("student-action-error-not-found"),
    };
  }

  const { studentStatus } = matchedStudent;
  if (studentStatus == "present" || studentStatus == "late") {
    return {
      success: true,
      message: t("student-action-success-already-active"),
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
    message: t("student-action-success-update-status"),
  };
}
