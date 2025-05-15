import {
  findSessionsWithFilteredPagination,
  getSessionCountWithFilter,
} from "@/db/queries/sessions";
import { paginate } from "@/lib/paginate";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const filter = {
    group: requestUrl.searchParams.get("group") || undefined,
  };
  const paginatedQuery = findSessionsWithFilteredPagination.bind(null, filter);
  const totalCount = await getSessionCountWithFilter(filter);
  const result = await paginate(request.url, paginatedQuery, totalCount);

  if (!result.success) notFound();
  return Response.json(result.response);
}
