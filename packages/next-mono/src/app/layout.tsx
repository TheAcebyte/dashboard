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
    <html lang="en">
      <body className={`${monaSans.className} antialiased`}>{children}</body>
    </html>
  );
}
