import {
  type PaginatedResponse,
  fetchNumberOfPages,
  fetchPage,
} from "@/lib/paginate";
import { useTableRefetchStore } from "@/stores/table-refetch-store";
import { useEffect, useState } from "react";

export default function usePagination<T>(
  endpoint: string | URL,
  limit: number,
  parameters?: Record<string, string>,
) {
  const [response, setResponse] = useState<PaginatedResponse<T>>();
  const [page, setPage] = useState(1);
  const gotoPage = (page: number) => setPage(page);
  const { volatile, refetch } = useTableRefetchStore();

  useEffect(() => {
    const url = new URL(endpoint);
    for (const parameter in parameters) {
      url.searchParams.set(parameter, parameters[parameter]);
    }

    const controller = new AbortController();
    const fetchResponse = async () => {
      const numberOfPages = await fetchNumberOfPages(
        endpoint,
        limit,
        controller.signal,
      );

      if (page == 0 && numberOfPages == 1) {
        setPage(1);
        return;
      }

      if (page > numberOfPages) {
        setPage(numberOfPages);
        return;
      }

      const response = await fetchPage<T>(url, page, limit, controller.signal);
      setResponse(response);
    };

    fetchResponse().catch((error) => console.log(error));
    return () => controller.abort("Request aborted.");
  }, [page, parameters, volatile]);

  useEffect(() => {
    setPage(1);
  }, [parameters]);

  if (!response) return null;
  return {
    response: {
      page: response.page,
      limit: response.limit,
      count: response.count,
      total: response.total,
      data: response.data,
    },
    gotoPage: gotoPage,
    refetch: refetch,
  };
}
