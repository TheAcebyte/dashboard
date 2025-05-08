import { cn, iterator } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createContext, useContext } from "react";

interface PaginationStatusProps {
  page: number;
  limit: number;
  count: number;
  total: number;
}

export function PaginationStatus({
  page,
  limit,
  count,
  total,
}: PaginationStatusProps) {
  const left = count == 0 ? 0 : (page - 1) * limit + 1;
  const right = count == 0 ? 0 : left + count - 1;

  return (
    <p className="font-medium text-gray-500">
      Showing
      <span className="font-semibold text-zinc-900">
        {` ${left}-${right} `}
      </span>
      of {total}
    </p>
  );
}

type PaginationControlContext = {
  lastPage: number;
  currentPage: number;
  gotoPage: (page: number) => void;
};

const paginationControlContext = createContext<PaginationControlContext | null>(
  null,
);

interface PaginationControlProps {
  page: number;
  limit: number;
  total: number;
  gotoPage: (page: number) => void;
}

export function PaginationControl({
  page,
  limit,
  total,
  gotoPage,
}: PaginationControlProps) {
  const lastPage = Math.ceil(total / limit);
  const isOnFirstPage = page <= 1;
  const isOnLastPage = page >= lastPage;
  const gotoPreviousPage = () => {
    if (!isOnFirstPage) gotoPage(page - 1);
  };
  const gotoNextPage = () => {
    if (!isOnLastPage) gotoPage(page + 1);
  };
  const contextValue = {
    currentPage: page,
    lastPage: lastPage,
    gotoPage: gotoPage,
  };

  return (
    <div className="flex items-center gap-4">
      <ChevronLeft
        width={20}
        height={20}
        className={cn(
          "transition-colors",
          isOnFirstPage
            ? "text-gray-400"
            : "cursor-pointer text-zinc-900 hover:text-zinc-700",
        )}
        onClick={gotoPreviousPage}
      />
      <ul
        style={{
          display: "grid",
          gridAutoColumns: "minmax(0, 1fr)",
          gridAutoFlow: "column",
          columnGap: "8px",
        }}
      >
        <paginationControlContext.Provider value={contextValue}>
          <ResponsivePageList />
        </paginationControlContext.Provider>
      </ul>
      <ChevronRight
        width={20}
        height={20}
        className={cn(
          "transition-colors",
          isOnLastPage
            ? "text-gray-400"
            : "cursor-pointer text-zinc-900 hover:text-zinc-700",
        )}
        onClick={gotoNextPage}
      />
    </div>
  );
}

export function ResponsivePageList() {
  const contextValue = useContext(paginationControlContext);
  if (!contextValue) {
    throw new Error(
      "ResponsivePageList must be placed inside a PaginationControl component.",
    );
  }

  const { lastPage, currentPage } = contextValue;
  if (lastPage <= 7) {
    return <SmallPageList />;
  } else if (currentPage <= 4) {
    return <LargePageListLeft />;
  } else if (currentPage >= lastPage - 3) {
    return <LargePageListRight />;
  } else {
    return <LargePageListCenter />;
  }
}

export function SmallPageList() {
  const contextValue = useContext(paginationControlContext);
  if (!contextValue) {
    throw new Error(
      "ResponsivePageList must be placed inside a PaginationControl component.",
    );
  }

  const { lastPage, currentPage, gotoPage } = contextValue;
  return iterator(lastPage).map((_, index) => {
    const page = index + 1;
    const isCurrentPage = page == currentPage;

    return (
      <li
        key={page}
        className={cn(
          "aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 outline-gray-300 transition-colors hover:bg-gray-50",
          isCurrentPage && "outline",
        )}
        onClick={() => gotoPage(page)}
      >
        {page}
      </li>
    );
  });
}

export function LargePageListLeft() {
  const contextValue = useContext(paginationControlContext);
  if (!contextValue) {
    throw new Error(
      "ResponsivePageList must be placed inside a PaginationControl component.",
    );
  }

  const { lastPage, currentPage, gotoPage } = contextValue;
  return (
    <>
      {iterator(5).map((_, index) => {
        const page = index + 1;
        const isCurrentPage = page == currentPage;

        return (
          <li
            key={page}
            className={cn(
              "aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 outline-gray-300 transition-colors hover:bg-gray-50",
              isCurrentPage && "outline",
            )}
            onClick={() => gotoPage(page)}
          >
            {page}
          </li>
        );
      })}
      <li
        key="ellipse"
        className="aspect-square rounded-lg p-1 text-center font-medium text-zinc-900"
      >
        ...
      </li>
      <li
        key={lastPage}
        className="aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 transition-colors hover:bg-gray-50"
        onClick={() => gotoPage(lastPage)}
      >
        {lastPage}
      </li>
    </>
  );
}

export function LargePageListRight() {
  const contextValue = useContext(paginationControlContext);
  if (!contextValue) {
    throw new Error(
      "ResponsivePageList must be placed inside a PaginationControl component.",
    );
  }

  const { lastPage, currentPage, gotoPage } = contextValue;
  return (
    <>
      <li
        key={1}
        className="aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 transition-colors hover:bg-gray-50"
        onClick={() => gotoPage(1)}
      >
        1
      </li>
      <li
        key="ellipse"
        className="aspect-square rounded-lg p-1 text-center font-medium text-zinc-900"
      >
        ...
      </li>
      {iterator(5).map((_, index) => {
        const page = index + lastPage - 4;
        const isCurrentPage = page == currentPage;

        return (
          <li
            key={page}
            className={cn(
              "aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 outline-gray-300 transition-colors hover:bg-gray-50",
              isCurrentPage && "outline",
            )}
            onClick={() => gotoPage(page)}
          >
            {page}
          </li>
        );
      })}
    </>
  );
}

export function LargePageListCenter() {
  const contextValue = useContext(paginationControlContext);
  if (!contextValue) {
    throw new Error(
      "ResponsivePageList must be placed inside a PaginationControl component.",
    );
  }

  const { lastPage, currentPage, gotoPage } = contextValue;
  return (
    <>
      <li
        key={1}
        className="aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 transition-colors hover:bg-gray-50"
        onClick={() => gotoPage(1)}
      >
        1
      </li>
      <li
        key="ellipse-1"
        className="aspect-square rounded-lg p-1 text-center font-medium text-zinc-900"
      >
        ...
      </li>
      {iterator(3).map((_, index) => {
        const page = index + currentPage - 1;
        const isCurrentPage = page == currentPage;

        return (
          <li
            key={page}
            className={cn(
              "aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 outline-gray-300 transition-colors hover:bg-gray-50",
              isCurrentPage && "outline",
            )}
            onClick={() => gotoPage(page)}
          >
            {page}
          </li>
        );
      })}
      <li
        key="ellipse-2"
        className="aspect-square rounded-lg p-1 text-center font-medium text-zinc-900"
      >
        ...
      </li>
      <li
        key={lastPage}
        className="aspect-square cursor-pointer rounded-lg p-1 text-center font-medium text-zinc-900 transition-colors hover:bg-gray-50"
        onClick={() => gotoPage(lastPage)}
      >
        {lastPage}
      </li>
    </>
  );
}
