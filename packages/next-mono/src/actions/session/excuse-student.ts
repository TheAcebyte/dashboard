"use server";

import {
  type ExcuseStudentFields,
  getExcuseStudentSchema,
} from "@/actions/session/validation";
import { db } from "@/db";
import { findStudentWithinSessionById } from "@/db/queries/sessions";
import { sessionStudents } from "@/db/schema/sessions";
import { and, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function excuseStudent(
  sessionId: string,
  studentId: string,
  payload: ExcuseStudentFields,
) {
  const t = await getTranslations("attendance-page");
  const excuseStudentSchema = getExcuseStudentSchema(t);

  const parseResult = excuseStudentSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

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

  await db
    .update(sessionStudents)
    .set({
      studentStatus: "excused",
      studentExcuse: payload.excuse,
      arrivedAt: null,
    })
    .where(
      and(
        eq(sessionStudents.sessionId, sessionId),
        eq(sessionStudents.studentId, studentId),
      ),
    );

  return {
    success: true,
    message: t("student-action-success-excuse"),
  };
}
