import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio Dashboard | Real-Time Stock Tracker",
  description:
    "Dynamic portfolio dashboard displaying real-time stock data with sector-wise grouping, gain/loss tracking, and interactive charts. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["portfolio", "stocks", "dashboard", "real-time", "NSE", "BSE", "finance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
