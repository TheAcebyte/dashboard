"use server";

import {
  type ExcuseStudentFields,
  excuseStudentSchema,
} from "@/actions/session/validation";
import { db } from "@/db";
import { findStudentWithinSessionById } from "@/db/queries/sessions";
import { sessionStudents } from "@/db/schema/sessions";
import { and, eq } from "drizzle-orm";

export default async function excuseStudent(
  sessionId: string,
  studentId: string,
  payload: ExcuseStudentFields,
) {
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
      message: "Could not find student within session.",
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
    message: "Successfully excused student.",
  };
}
