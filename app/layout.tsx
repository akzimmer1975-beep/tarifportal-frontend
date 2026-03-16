import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tarifvergleichsportal",
  description: "KI-gestützter Vergleich von Tarifregelungen"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}