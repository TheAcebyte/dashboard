import { findActiveSessionByGroupId } from "@/db/queries/sessions";
import { notFound } from "next/navigation";

interface Parameters {
  groupId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { groupId } = await params;
  const data = await findActiveSessionByGroupId(groupId);
  if (!data) notFound();

  return Response.json(data);
}
