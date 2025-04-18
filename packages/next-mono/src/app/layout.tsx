import Sidebar from "@/components/sidebar";
import ThemeProvider from "@/components/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

export const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

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
      <body className={`${monaSans.className} bg-primary-bg antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex w-full">
            <Sidebar />
            <div className="flex-1">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
