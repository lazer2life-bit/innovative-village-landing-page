import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "GramBudget - Smart Village Budget & Expense Management",
  description:
    "Improving transparency and accountability in village finances. Digital budget tracking, expense logging, and insightful reports for Gram Panchayats.",
  keywords: [
    "GramBudget",
    "village finance",
    "Gram Panchayat",
    "budget management",
    "expense tracking",
  ],
};

export const viewport: Viewport = {
  themeColor: "#2d8a5e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
