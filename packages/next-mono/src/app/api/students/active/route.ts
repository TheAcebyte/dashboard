import {
  findActiveStudentsSinceDateWithPagination,
  getActiveStudentsSinceDateCount,
} from "@/db/queries/sessions";
import { paginate } from "@/lib/paginate";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const since = Number(requestUrl.searchParams.get("since")) ?? 0;
  const paginatedQuery = findActiveStudentsSinceDateWithPagination.bind(
    null,
    since,
  );
  const totalCount = await getActiveStudentsSinceDateCount(since);
  const result = await paginate(request.url, paginatedQuery, totalCount);

  if (!result.success) notFound();
  return Response.json(result.response);
}
