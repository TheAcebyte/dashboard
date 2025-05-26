"use server";

import { db } from "@/db";
import { findStudentById } from "@/db/queries/students";
import { studentPictures, students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function deleteStudent(
  studentId: string,
): Promise<ServerActionResponse> {
  const t = await getTranslations("database-page");
  const matchedStudent = await findStudentById(studentId);
  if (!matchedStudent) {
    return { success: false, message: t("student-action-error-not-found") };
  }

  await db
    .delete(studentPictures)
    .where(eq(studentPictures.studentId, studentId));
  await db.delete(students).where(eq(students.studentId, studentId));
  return { success: true, message: t("student-action-success-delete") };
}
