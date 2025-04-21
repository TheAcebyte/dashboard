import { StudentFields } from "@/actions/add-student/validation";

export default async function addStudent(payload: StudentFields) {
  return { success: true, message: "Added" };
}
