import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northbridge Student Portal",
  description: "A modern university student portal dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
