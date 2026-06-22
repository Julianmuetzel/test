import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HumanRank — Wo stehst du wirklich?",
  description:
    "Teste deine Fähigkeiten und entdecke, wo du im weltweiten Vergleich stehst. Reaktion, Gedächtnis, Logik und mehr.",
  keywords: ["Reaktionszeit", "Gedächtnis", "IQ Test", "Ranking", "Human Benchmark"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
