import {
  findGroupsWithFilteredPagination,
  getGroupCountWithFilter,
} from "@/db/queries/groups";
import { paginate } from "@/lib/paginate";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const filter = {
    name: requestUrl.searchParams.get("name") || undefined,
  };
  const paginatedQuery = findGroupsWithFilteredPagination.bind(null, filter);
  const totalCount = await getGroupCountWithFilter(filter);
  const result = await paginate(request.url, paginatedQuery, totalCount);

  if (!result.success) notFound();
  return Response.json(result.response);
}
