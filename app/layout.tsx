import React from "react"
import { Chatbot } from "@/components/chatbot";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata = {
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

export const viewport = {
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Chatbot />
        <SpeedInsights />
      </body>
    </html>
  );
}
