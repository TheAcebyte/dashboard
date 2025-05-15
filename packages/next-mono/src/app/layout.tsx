import ActionIcons from "@/components/action-icons";
import Sidebar from "@/components/sidebar";
import ThemeProvider from "@/components/theme-provider";
import { monaSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-primary-bg antialiased", monaSans.className)}>
        <Suspense>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <main className="flex w-full">
              <Sidebar />
              {children}
            </main>
            <ActionIcons />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
