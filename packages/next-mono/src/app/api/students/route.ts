import {
  findStudentsWithFilteredPagination,
  getStudentCountWithFilter,
} from "@/db/queries/students";
import { paginate } from "@/lib/paginate";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const filter = {
    name: requestUrl.searchParams.get("name") || undefined,
    cne: requestUrl.searchParams.get("cne") || undefined,
    age: requestUrl.searchParams.get("age") || undefined,
    group: requestUrl.searchParams.get("group") || undefined,
  };
  const paginatedQuery = findStudentsWithFilteredPagination.bind(null, filter);
  const totalCount = await getStudentCountWithFilter(filter);
  const result = await paginate(request.url, paginatedQuery, totalCount);

  if (!result.success) notFound();
  return Response.json(result.response);
}
