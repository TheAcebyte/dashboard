import {
  type StudentFields,
  studentSchema,
} from "@/actions/add-student/validation";
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

  return { success: true, message: "Added" };
}
