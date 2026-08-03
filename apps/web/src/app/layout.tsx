import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inria_Serif, Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inriaSerif = Inria_Serif({
  variable: "--font-inria-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteDescription =
  "A private, thoughtfully organized notebook for capturing ideas and keeping them close.";

export const metadata: Metadata = {
  applicationName: "Turbo Notes",
  title: {
    default: "Turbo Notes — A softer place for your thoughts",
    template: "%s · Turbo Notes",
  },
  description: siteDescription,
  keywords: [
    "notes",
    "private notebook",
    "note taking",
    "personal organization",
  ],
  authors: [{ name: "Turbo Notes" }],
  creator: "Turbo Notes",
  publisher: "Turbo Notes",
  category: "productivity",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Turbo Notes",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Turbo Notes",
    title: "Turbo Notes — A softer place for your thoughts",
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: "Turbo Notes — A softer place for your thoughts",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#faf1e3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} ${geistMono.variable} ${inriaSerif.variable} app-scrollbar app-scrollbar-stable`}
    >
      <body className="app-scrollbar">
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
