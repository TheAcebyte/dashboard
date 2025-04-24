import { PaginatedResponse } from "@/lib/paginate";
import { useEffect, useState } from "react";

export default function usePagination<T>(
  endpoint: string | URL,
  limit: number,
) {
  const [response, setResponse] = useState<PaginatedResponse<T>>();
  const [page, setPage] = useState(1);
  const gotoPage = (page: number) => setPage(page);

  useEffect(() => {
    const url = new URL(endpoint);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("limit", limit.toString());
    fetch(url)
      .then((response) => response.json())
      .then((paginated) => setResponse(paginated));
  }, [page]);

  if (!response) return null;
  return {
    page: response.page,
    limit: response.limit,
    count: response.count,
    total: response.total,
    data: response.data,
    gotoPage: gotoPage,
  };
}
