import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { GamificationProvider } from "@/components/gamification/XPToast";
import ThemeScript from "@/components/theme/ThemeScript";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "PREPSMART — Understand. Practise. Revise. | JAMB 4-Week Prep",
    template: "%s | PREPSMART",
  },
  description:
    "PREPSMART: A clean, modern 4-week JAMB/UTME preparation platform covering Science, Arts & Humanities, and Commercial streams according to the official syllabus.",
  keywords: [
    "JAMB",
    "UTME",
    "CBT Exam Preparation",
    "Nigerian Syllabus",
    "Use of English",
    "Science",
    "Arts",
    "Commercial",
    "Past Questions",
    "Active Recall",
    "Flashcards",
  ],
  authors: [{ name: "PrepSmart" }],
  creator: "PrepSmart",
  publisher: "PrepSmart",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://prepsmart-1.ai.studio/",
    siteName: "PREPSMART",
    title: "PREPSMART — Understand. Practise. Revise.",
    description:
      "A clean, modern 4-week JAMB/UTME preparation platform covering Science, Arts & Humanities, and Commercial streams according to the official syllabus.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PREPSMART — Understand. Practise. Revise.",
    description:
      "A clean, modern 4-week JAMB/UTME preparation platform covering Science, Arts & Humanities, and Commercial streams according to the official syllabus.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} h-full antialiased`}
      >
        <head>
          <ThemeScript />
        </head>
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-200 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
          <ThemeProvider>
            <QueryProvider>
              <GamificationProvider>
                <Suspense
                  fallback={
                    <div className="h-16 border-b border-border bg-card" />
                  }
                >
                  <Navbar />
                </Suspense>
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                  {children}
                </main>
                <Footer />
              </GamificationProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
