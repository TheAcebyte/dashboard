import { findStudentPictureById } from "@/db/queries/students";
import { notFound } from "next/navigation";

interface Parameters {
  studentId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { studentId } = await params;
  const data = await findStudentPictureById(studentId);

  if (!data) notFound();
  return new Response(data.picture);
}
