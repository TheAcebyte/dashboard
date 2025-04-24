const defaultPage = 1;
const defaultLimit = 10;

type PaginatedFetchDataCallback<R> = (
  limit: number,
  offset: number,
) => Promise<R[]>;

type FetchTotalCallback = () => Promise<number>;

export type PaginatedResponse<R> = {
  page: number;
  limit: number;
  total: number;
  count: number;
  data: R[];
  paging: {
    previous: string | null;
    next: string | null;
  };
};

type PaginatedResult<R> =
  | { success: false }
  | {
      success: true;
      response: PaginatedResponse<R>;
    };

export default async function paginate<R>(
  endpoint: string,
  fetchData: PaginatedFetchDataCallback<R>,
  fetchTotal: FetchTotalCallback,
): Promise<PaginatedResult<R>> {
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

  const data = await fetchData(page, limit);
  const total = await fetchTotal();
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
