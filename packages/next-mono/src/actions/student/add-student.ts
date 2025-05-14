"use server";

import {
  type StudentFields,
  studentSchema,
} from "@/actions/student/validation";
import { cst } from "@/constants";
import { db } from "@/db";
import { findStudentByCNE } from "@/db/queries/students";
import { studentPictures, students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { randomUUID } from "crypto";

export default async function addStudent(
  payload: StudentFields,
): Promise<ServerActionResponse> {
  const parseResult = studentSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: "Serverside validation failed." };
  }

  const matchedStudent = await findStudentByCNE(payload.cne);
  if (matchedStudent) {
    return { success: false, message: "CNE is already taken." };
  }

  const day = payload.birthDate.slice(0, 2);
  const month = payload.birthDate.slice(2, 4);
  const year = payload.birthDate.slice(4);
  const usLocaleDate = `${month}/${day}/${year}`;

  const studentId = randomUUID();
  const birthDate = new Date(usLocaleDate).getTime();
  const fileArrayBuffer = await payload.file.arrayBuffer();
  const picture = Buffer.from(fileArrayBuffer);
  const pictureUrl = new URL(`/api/students/${studentId}/picture`, cst.APP_URL);

  await db.insert(students).values({
    studentId: studentId,
    firstName: payload.firstName,
    lastName: payload.lastName,
    cne: payload.cne,
    birthDate: birthDate,
    groupId: payload.groupId,
    pictureUrl: pictureUrl.toString(),
  });
  
  await db.insert(studentPictures).values({
    studentId: studentId,
    picture: picture,
  });

  return { success: true, message: "Successfully added student." };
}
