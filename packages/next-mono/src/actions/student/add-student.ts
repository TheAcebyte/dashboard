"use server";

import {
  type StudentFields,
  getStudentSchema,
} from "@/actions/student/validation";
import { env } from "@/constants/env";
import { db } from "@/db";
import { findStudentByCNE } from "@/db/queries/students";
import { studentPictures, students } from "@/db/schema/students";
import type { ServerActionResponse } from "@/types/utils";
import { randomUUID } from "crypto";
import { getTranslations } from "next-intl/server";

const datasetEndpoint = new URL("/add_toDB", env.FLASK_APP_URL);

export default async function addStudent(
  payload: StudentFields,
): Promise<ServerActionResponse> {
  const t = await getTranslations("database-page");
  const studentSchema = getStudentSchema(t);

  const parseResult = studentSchema.safeParse(payload);
  if (!parseResult) {
    return { success: false, message: t("student-action-error-validation") };
  }

  const matchedStudent = await findStudentByCNE(payload.cne);
  if (matchedStudent) {
    return { success: false, message: t("student-action-error-duplicate-cne") };
  }

  const day = payload.birthDate.slice(0, 2);
  const month = payload.birthDate.slice(2, 4);
  const year = payload.birthDate.slice(4);
  const usLocaleDate = `${month}/${day}/${year}`;

  const studentId = randomUUID();
  const birthDate = new Date(usLocaleDate).getTime();
  const fileArrayBuffer = await payload.file.arrayBuffer();
  const picture = Buffer.from(fileArrayBuffer);
  const pictureUrl = `/api/students/${studentId}/picture`;

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

  try {
    await fetch(datasetEndpoint, {
      method: "POST",
      body: JSON.stringify({
        studentId,
        pictureUrl,
      }),
    });
  } catch (e) {
    console.error(e);
  }

  return { success: true, message: t("student-action-success-add") };
}
