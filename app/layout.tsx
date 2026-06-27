import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { CountryProvider } from "@/contexts/country-context";
import { CityProvider } from "@/contexts/city-context";
import { CategoryProvider } from "@/contexts/category-context";
import { CourseProvider } from "@/contexts/course-context";
import { NewsProvider } from "@/contexts/news-context";
import { BlogProvider } from "@/contexts/blog-context";
import { ExamProvider } from "@/contexts/exam-context";
import { PageLoadingBar } from "@/components/ui/page-loading-bar";
import { SITE_IDENTITY, meta } from "./(main)/site-identity";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE_IDENTITY.domain}`),
  title: {
    default: meta.title,
    template: `%s | ${SITE_IDENTITY.name}`,
  },
  description: meta.description,
  keywords: meta.keywords,
  authors: [{ name: meta.author }],
  creator: meta.author,
  themeColor: SITE_IDENTITY.brand.primaryColor,
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: `https://${SITE_IDENTITY.domain}`,
    siteName: SITE_IDENTITY.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: meta.ogImage || '/logo.png',
        width: 1200,
        height: 630,
        alt: `${SITE_IDENTITY.name} Logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    images: [meta.ogImage || '/logo.png'],
    creator: `@${meta.author.replace(/\s+/g, '')}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `https://${SITE_IDENTITY.domain}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans", inter.variable)}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Suspense fallback={null}>
            <PageLoadingBar />
          </Suspense>
          <QueryProvider>
            <CategoryProvider>
              <ExamProvider>
                <BlogProvider>
                  <NewsProvider>
                    <CourseProvider>
                      <CountryProvider>
                        <CityProvider>
                          {children}
                        </CityProvider>
                      </CountryProvider>
                    </CourseProvider>
                  </NewsProvider>
                </BlogProvider>
              </ExamProvider>
            </CategoryProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}