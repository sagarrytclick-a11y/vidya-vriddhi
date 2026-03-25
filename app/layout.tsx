import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
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
  title: "Vidya Vridhi",
  description: "Get Your College",
  icons: {
    icon: '/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <CategoryProvider>
            <ExamProvider>
              <BlogProvider>
                <NewsProvider>
                  <CourseProvider>
                    <CountryProvider>
                      <CityProvider>
                        <CategoryProvider>
                          {children}
                        </CategoryProvider>
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
  );
}
