import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { PageLoadingBar } from "@/components/ui/page-loading-bar";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { SITE_IDENTITY, meta } from "./(main)/site-identity";

export const viewport: Viewport = {
  themeColor: SITE_IDENTITY.brand.primaryColor,
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
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
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">
        <Suspense fallback={null}>
          <PageLoadingBar />
        </Suspense>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}