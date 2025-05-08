"use server";

import { db } from "@/db";
import { findStudentById } from "@/db/queries/students";
import { studentPictures, students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";

export default async function deleteStudent(
  studentId: string,
): Promise<ServerActionResponse> {
  const matchedStudent = await findStudentById(studentId);
  if (!matchedStudent) {
    return { success: false, message: "Could not find student." };
  }
  
  await db
    .delete(studentPictures)
    .where(eq(studentPictures.studentId, studentId));
  await db.delete(students).where(eq(students.studentId, studentId));
  return { success: true, message: "Successfully deleted student." };
}
