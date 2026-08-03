import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turbo Notes",
  description: "A focused notes application built with Next.js and Django.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="bg-card focus-visible:ring-ring fixed top-3 left-3 z-[100] -translate-y-20 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-transform focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:outline-none"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
