import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifvergleichsportal",
  description: "Tarifvergleich zwischen GDL und EVG mit KI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-zinc-50 text-zinc-900 antialiased">{children}</body>
    </html>
  );
}