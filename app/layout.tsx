import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import { themeInitScript } from "@/lib/theme-script";
import { Footer } from "@/components/Footer";
import { GraphRail } from "@/components/graph/GraphRail";
import { SceneMount } from "@/components/scene/SceneMount";
import { ScrollDriver } from "@/components/scene/ScrollDriver";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { links } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const title = "Aditya Ahlawat — multi-agent systems, held accountable";
const description =
  "Aditya Ahlawat builds multi-agent AI systems and serverless cloud tooling — RAG pipelines, LangGraph workflows, and validation layers that catch hallucinations instead of shipping them.";

export const metadata: Metadata = {
  metadataBase: new URL("https://adityaahlawat.dev"),
  title,
  description,
  alternates: { canonical: "https://adityaahlawat.dev" },
  openGraph: {
    title,
    description,
    url: "https://adityaahlawat.dev",
    siteName: "Aditya Ahlawat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  manifest: "/manifest.json",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aditya Ahlawat",
  url: "https://adityaahlawat.dev",
  jobTitle: "AI/ML Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Delhi Technological University",
  },
  sameAs: [links.github, links.linkedin, links.leetcode, links.codolio],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-void text-vellum">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[2px] focus:bg-signal focus:px-4 focus:py-2 focus:text-void focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>
        <ScrollDriver />
        <SceneMount />
        <GraphRail />
        <div className="fixed top-3 right-4 z-40 lg:top-4">
          <ThemeToggle />
        </div>
        <Footer />
        <div className="relative z-10 pt-14 lg:pt-0 lg:pl-20">{children}</div>
      </body>
    </html>
  );
}
