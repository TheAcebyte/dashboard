import {
  findSessionStudentsWithFilteredPagination,
  getSessionStudentCountWithFilter,
} from "@/db/queries/sessions";
import { paginate } from "@/lib/paginate";
import { notFound } from "next/navigation";

interface Parameters {
  sessionId: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Parameters> },
) {
  const { sessionId } = await params;
  const requestUrl = new URL(request.url);
  const filter = {
    name: requestUrl.searchParams.get("name") || undefined,
    status: requestUrl.searchParams.get("status") || undefined,
  };
  const paginatedQuery = findSessionStudentsWithFilteredPagination.bind(
    null,
    sessionId,
    filter,
  );
  const totalCount = await getSessionStudentCountWithFilter(sessionId, filter);
  const result = await paginate(request.url, paginatedQuery, totalCount);

  if (!result.success) notFound();
  return Response.json(result.response);
}
