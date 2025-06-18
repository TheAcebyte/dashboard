import { findStudentPictureById } from "@/db/queries/students";
import { notFound } from "next/navigation";
import { Buffer } from "node:buffer";

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

  const buffer = Buffer.from(data.picture);
  const blob = new Blob([buffer]);
  return new Response(blob);
}
