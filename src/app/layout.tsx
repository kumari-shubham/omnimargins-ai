import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniMetrics AI — Autonomous Multimodal Data Analyst & Strategy Studio",
  description: "AI-powered data science, statistical regression, multi-agent deliberation, and scenario modeling for startups and founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
