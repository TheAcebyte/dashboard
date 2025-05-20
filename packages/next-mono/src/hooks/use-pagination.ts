import {
  type PaginatedResponse,
  fetchNumberOfPages,
  fetchPage,
} from "@/lib/paginate";
import { useEffect, useState } from "react";

interface UsePaginationOptions {
  queryParams?: Record<string, string>;
  refetchCounter: number;
}

export default function usePagination<T>(
  endpoint: string | URL,
  limit: number,
  options?: UsePaginationOptions,
) {
  const [response, setResponse] = useState<PaginatedResponse<T>>();
  const [page, setPage] = useState(1);
  const gotoPage = (page: number) => setPage(page);

  useEffect(() => {
    const url = new URL(endpoint);
    for (const parameter in options?.queryParams) {
      url.searchParams.set(parameter, options?.queryParams[parameter]);
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
  }, [page, endpoint.toString(), options?.queryParams, options?.refetchCounter]);

  useEffect(() => {
    setPage(1);
  }, [endpoint.toString(), options?.queryParams]);

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
  };
}
