import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ConditionalFooter } from "@/components/shared/ConditionalFooter";
import { PageTransition } from "@/components/shared/PageTransition";

export const metadata: Metadata = {
  title: "Freelance City Index, Yogyakarta Edition",
  description:
    "Temukan distrik terbaik di DIY untuk kerja freelance & remote, berdasarkan data, bukan asumsi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink">
        <PageTransition className="flex-1">
          {children}
        </PageTransition>
        <ConditionalFooter />
      </body>
    </html>
  );
}
