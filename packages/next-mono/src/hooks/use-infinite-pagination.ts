import {
  type InfinitePaginatedResponse,
  fetchNPages,
  fetchNumberOfPages,
} from "@/lib/paginate";
import { useEffect, useState } from "react";

interface UseInfinitePaginationOptions {
  queryParams?: Record<string, string>;
  refetchCounter?: number;
}

/**
 * This hook is shamelessly unoptimized. Instead of fetching data batch-by-batch,
 * it fetches the first n-pages everytime one of the dependencies is mutated.
 */
export default function useInfinitePagination<T>(
  endpoint: string | URL,
  limit: number,
  options?: UseInfinitePaginationOptions,
) {
  const [response, setResponse] = useState<InfinitePaginatedResponse<T>>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const url = new URL(endpoint);
    for (const parameter in options?.queryParams) {
      url.searchParams.set(parameter, options?.queryParams[parameter]);
    }

    console.log(url);

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

      const response = await fetchNPages<T>(
        url,
        page,
        limit,
        controller.signal,
      );
      setResponse(response);
    };

    fetchResponse().catch((error) => console.log(error));
    return () => controller.abort("Request aborted.");
  }, [page, endpoint, options?.queryParams, options?.refetchCounter]);

  useEffect(() => {
    setPage(1);
  }, [endpoint, options?.queryParams]);

  const loadMore = () => {
    setPage(page + 1);
  };

  if (!response) return null;
  return {
    response: {
      page: response.page,
      total: response.total,
      count: response.count,
      remaining: response.remaining,
      data: response.data,
    },
    loadMore: loadMore,
  };
}
