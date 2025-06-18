import { findSessionById } from "@/db/queries/sessions";
import { notFound } from "next/navigation";

interface Parameters {
  sessionId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { sessionId } = await params;
  const data = await findSessionById(sessionId);

  if (!data) notFound();
  return Response.json(data);
}
