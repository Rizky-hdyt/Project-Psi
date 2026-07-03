import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalFooter } from "@/components/shared/ConditionalFooter";
import { PageTransition } from "@/components/shared/PageTransition";

// Space Grotesk (display+UI) / Space Mono (angka & data),
// satu keluarga desain dengan karakter teknis-hangat
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

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
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
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
