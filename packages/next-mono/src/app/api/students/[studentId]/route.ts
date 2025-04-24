import { findStudentById } from "@/db/queries/students";

interface Parameters {
  studentId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { studentId } = await params;
  const a = await findStudentById(studentId);
  return Response.json(a);
}
