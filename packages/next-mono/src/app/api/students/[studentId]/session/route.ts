import updateStudentStatus from "@/actions/session/update-student-status";
import { findActiveSessionByStudentId } from "@/db/queries/sessions";
import { notFound } from "next/navigation";

interface Parameters {
  studentId: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { studentId } = await params;
  const data = await findActiveSessionByStudentId(studentId);
  if (!data.found) notFound();

  const { sessionId } = data.session;
  const response = await updateStudentStatus(sessionId, studentId);
  return Response.json(response);
}
