import ActionIcons from "@/components/action-icons";
import Sidebar from "@/components/sidebar";
import ThemeProvider from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { monaSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface Parameters {
  locale: string;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<Parameters>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-primary-bg antialiased", monaSans.className)}>
        <Suspense>
          <NextIntlClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <main className="flex w-full">
                <Sidebar />
                {children}
              </main>
              <ActionIcons />
            </ThemeProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
