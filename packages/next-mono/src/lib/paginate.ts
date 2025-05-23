import { z } from "zod";

const defaultPage = 1;
const defaultLimit = 10;

type PaginatedQueryCallback<T> = (
  limit: number,
  offset: number,
) => Promise<T[]>;

export type PaginatedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  count: number;
  data: T[];
  paging: {
    previous: string | null;
    next: string | null;
  };
};

export type InfinitePaginatedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  count: number;
  remaining: number;
  data: T[];
};

type PaginatedResult<T> =
  | { success: false }
  | {
      success: true;
      response: PaginatedResponse<T>;
    };

export async function paginate<T>(
  endpoint: string | URL,
  paginatedQuery: PaginatedQueryCallback<T>,
  total: number,
): Promise<PaginatedResult<T>> {
  const url = new URL(endpoint);
  const parameters = {
    page: url.searchParams.get("page"),
    limit: url.searchParams.get("limit"),
  };

  const page = parameters.page ? parseInt(parameters.page) : defaultPage;
  const limit = parameters.limit ? parseInt(parameters.limit) : defaultLimit;
  if (isNaN(page) || isNaN(limit)) {
    return { success: false };
  }

  const data = await paginatedQuery(page, limit);
  const count = data.length;
  const previousUrl = new URL(endpoint);
  const nextUrl = new URL(endpoint);
  previousUrl.searchParams.set("page", `${page - 1}`);
  nextUrl.searchParams.set("page", `${page + 1}`);
  const previousPage = page == 1 ? null : previousUrl.toString();
  const nextPage = count != limit ? null : nextUrl.toString();

  return {
    success: true,
    response: {
      page: page,
      limit: limit,
      total: total,
      count: count,
      data: data,
      paging: {
        previous: previousPage,
        next: nextPage,
      },
    },
  };
}

const paginatedResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  count: z.number(),
  data: z.array(z.unknown()),
  paging: z.object({
    previous: z.union([z.string(), z.null()]),
    next: z.union([z.string(), z.null()]),
  }),
});

export async function fetchPage<T>(
  endpoint: string | URL,
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<PaginatedResponse<T>> {
  const url = new URL(endpoint);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());
  const response = await fetch(url, { signal });
  const paginated = await response.json();
  const parseResult = paginatedResponseSchema.safeParse(paginated);
  if (!parseResult.success) {
    throw new Error("Failed to parse paginated response.");
  }

  return parseResult.data as PaginatedResponse<T>;
}

export async function fetchNPages<T>(
  endpoint: string | URL,
  n: number,
  limit: number,
  signal?: AbortSignal,
): Promise<InfinitePaginatedResponse<T>> {
  const url = new URL(endpoint);
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", limit.toString());
  let currentEndpoint: string | null = url.toString();
  let page = 0;
  let total = 0;
  let count = 0;
  const data: T[] = [];

  while (currentEndpoint && page < n) {
    const response = await fetch(currentEndpoint, { signal });
    const paginated = await response.json();
    const parseResult = paginatedResponseSchema.safeParse(paginated);
    if (!parseResult.success) {
      throw new Error("Failed to parse paginated response.");
    }

    currentEndpoint = parseResult.data.paging.next;
    page = parseResult.data.page;
    total = parseResult.data.total;
    count += parseResult.data.count;
    const items = parseResult.data.data as T[];
    data.push(...items);
  }

  return {
    page: n,
    limit: limit,
    total: total,
    count: count,
    remaining: total - count,
    data: data,
  };
}

export async function fetchAllPages<T>(
  endpoint: string | URL,
  signal?: AbortSignal,
) {
  let currentEndpoint: string | null =
    endpoint instanceof URL ? endpoint.toString() : endpoint;
  const items: T[] = [];

  while (currentEndpoint) {
    const response = await fetch(currentEndpoint, { signal });
    const paginated = await response.json();
    const parseResult = paginatedResponseSchema.safeParse(paginated);
    if (!parseResult.success) return items;

    const data = parseResult.data.data as T[];
    items.push(...data);
    currentEndpoint = parseResult.data.paging.next;
  }

  return items;
}

export async function fetchNumberOfPages(
  endpoint: string | URL,
  limit: number,
  signal?: AbortSignal,
) {
  const url = new URL(endpoint);
  const response = await fetch(url, { signal });
  const paginated = await response.json();
  const parseResult = paginatedResponseSchema.safeParse(paginated);
  if (!parseResult.success) return 0;

  return Math.ceil(paginated.total / limit);
}
