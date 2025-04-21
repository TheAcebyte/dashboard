"use server";

import {
  type StudentFields,
  studentSchema,
} from "@/actions/add-student/validation";
import { db } from "@/db";
import { findStudentByCNE, studentsTable } from "@/db/schema/students";
import { isImage } from "@/lib/utils";
import type { ServerActionResponse } from "@/types/utils";

export default async function addStudent(
  payload: StudentFields,
): Promise<ServerActionResponse> {
  const parseResult = studentSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  if (!isImage(payload.file)) {
    return { success: false, message: "Uploaded file is not an image." };
  }

  const matchedStudents = await findStudentByCNE(payload.cne);
  if (matchedStudents.length != 0) {
    return { success: false, message: "CNE is already taken." };
  }

  const birthDate = new Date(payload.birthDate);
  const fileArrayBuffer = await payload.file.arrayBuffer();
  const picture = Buffer.from(fileArrayBuffer);
  await db.insert(studentsTable).values({
    firstName: payload.firstName,
    lastName: payload.lastName,
    cne: payload.cne,
    birthDate: birthDate,
    picture: picture,
  });

  return { success: true, message: "Successfully added student." };
}
