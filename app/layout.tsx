import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Opportunity Finder AI",
  description: "Find businesses without websites or with outdated web presence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
