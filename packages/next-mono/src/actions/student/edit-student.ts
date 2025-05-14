"use server";

import {
  type StudentFields,
  studentSchema,
} from "@/actions/student/validation";
import { db } from "@/db";
import { findStudentByCNE, findStudentById } from "@/db/queries/students";
import { studentPictures, students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { eq } from "drizzle-orm";

export default async function editStudent(
  studentId: string,
  payload: StudentFields,
): Promise<ServerActionResponse> {
  const parseResult = studentSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  const matchedCNEStudent = await findStudentByCNE(payload.cne);
  if (matchedCNEStudent && matchedCNEStudent.studentId != studentId) {
    return { success: false, message: "CNE is already taken." };
  }

  const matchedIdStudent = await findStudentById(studentId);
  if (!matchedIdStudent) {
    return { success: false, message: "Could not find student." };
  }

  const day = payload.birthDate.slice(0, 2);
  const month = payload.birthDate.slice(2, 4);
  const year = payload.birthDate.slice(4);
  const usLocaleDate = `${month}/${day}/${year}`;

  const birthDate = new Date(usLocaleDate).getTime();
  const fileArrayBuffer = await payload.file.arrayBuffer();
  const picture = Buffer.from(fileArrayBuffer);

  await db
    .update(students)
    .set({
      firstName: payload.firstName,
      lastName: payload.lastName,
      cne: payload.cne,
      birthDate: birthDate,
      groupId: payload.groupId,
    })
    .where(eq(students.studentId, studentId));
    
  await db
    .update(studentPictures)
    .set({
      picture: picture,
    })
    .where(eq(studentPictures.studentId, studentId));

  return { success: true, message: "Successfully edited student." };
}
