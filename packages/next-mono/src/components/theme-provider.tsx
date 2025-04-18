"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps, useEffect, useState } from "react";

export default function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>; // Wrap children with ThemeProvider after mount
}
