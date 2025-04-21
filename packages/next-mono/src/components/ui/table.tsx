"use client";

import { cn } from "@/lib/utils";
import { ReactNode, createContext, useContext } from "react";

const tableContext = createContext(true);
const tableRowContext = createContext(true);

interface TableProps {
  className?: string;
  children?: ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className={className}>
      <tableContext.Provider value={true}>{children}</tableContext.Provider>
    </div>
  );
}

interface TableHeaderProps {
  className?: string;
  children?: ReactNode;
}

export function TableHeader({ className, children }: TableHeaderProps) {
  const contextValue = useContext(tableContext);
  if (!contextValue) {
    throw new Error("TableHeader must be placed inside a Table component.");
  }

  return (
    <div
      className={cn("flex bg-gray-100 font-medium text-gray-500", className)}
      style={{
        display: "grid",
        gridAutoColumns: "minmax(0, 1fr)",
        gridAutoFlow: "column",
      }}
    >
      {children}
    </div>
  );
}

interface TableRowProps {
  className?: string;
  children?: ReactNode;
}

export function TableRow({ className, children }: TableRowProps) {
  const contextValue = useContext(tableContext);
  if (!contextValue) {
    throw new Error("TableRow must be placed inside a Table component.");
  }

  return (
    <div
      className={cn("border-b border-gray-300 text-zinc-900", className)}
      style={{
        display: "grid",
        gridAutoColumns: "minmax(0, 1fr)",
        gridAutoFlow: "column",
      }}
    >
      {children}
    </div>
  );
}

interface TableCellProps {
  weight?: number;
  className?: string;
  children?: ReactNode;
}

export function TableCell({ weight, className, children }: TableCellProps) {
  const contextValue = useContext(tableRowContext);
  if (!contextValue) {
    throw new Error(
      "TableCell must be placed inside a TableRow or TableHeader component.",
    );
  }

  const cellWeight = weight ?? 1;
  return (
    <div
      className={cn(
        "overflow-hidden overflow-ellipsis whitespace-nowrap",
        className,
      )}
      style={{ gridColumn: `span ${cellWeight}` }}
    >
      {children}
    </div>
  );
}
