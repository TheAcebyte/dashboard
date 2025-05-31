"use client";

import useMounted from "@/hooks/use-mounted";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ComponentProps } from "react";

export default function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const mounted = useMounted();

  if (!mounted) return <>{children}</>;
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
