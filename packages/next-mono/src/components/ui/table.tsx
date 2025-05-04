"use client";

import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode, createContext, useContext } from "react";

const tableRowStyles = {
  header: {
    row: "flex rounded-l-full rounded-r-full bg-gray-50",
    cell: "text-gray-500 font-medium px-8 py-1",
  },
  body: {
    row: "border-b border-gray-200",
    cell: "text-gray-900 px-8 py-6",
  },
} satisfies Record<string, { row: string; cell: string }>;

type TableRowVariant = keyof typeof tableRowStyles;

const tableContext = createContext(true);
const tableRowContext = createContext<TableRowVariant | null>(null);

interface TableProps {
  className?: string;
  children?: ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <ul className={className}>
      <tableContext.Provider value={true}>{children}</tableContext.Provider>
    </ul>
  );
}

interface TableRowProps {
  variant?: TableRowVariant;
}

export function TableRow({
  variant = "body",
  className,
  children,
  ...props
}: TableRowProps & ComponentProps<"li">) {
  const contextValue = useContext(tableContext);
  if (!contextValue) {
    throw new Error("TableRow must be placed inside a Table component.");
  }

  return (
    <li
      className={cn(tableRowStyles[variant].row, className)}
      style={{
        display: "grid",
        gridAutoColumns: "minmax(0, 1fr)",
        gridAutoFlow: "column",
        alignItems: "center",
      }}
      {...props}
    >
      <tableRowContext.Provider value={variant}>
        {children}
      </tableRowContext.Provider>
    </li>
  );
}

interface TableCellProps {
  weight?: number;
  className?: string;
  children?: ReactNode;
}

export function TableCell({ weight = 1, className, children }: TableCellProps) {
  const contextValue = useContext(tableRowContext);
  if (!contextValue) {
    throw new Error("TableCell must be placed inside a TableRow component.");
  }

  return (
    <div
      className={cn(
        "overflow-hidden overflow-ellipsis whitespace-nowrap",
        tableRowStyles[contextValue].cell,
        className,
      )}
      style={{
        gridColumn: `span ${weight}`,
      }}
    >
      {children}
    </div>
  );
}
