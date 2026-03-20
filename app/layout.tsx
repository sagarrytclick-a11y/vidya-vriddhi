import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { CountryProvider } from "@/contexts/country-context";
import { CityProvider } from "@/contexts/city-context";
import { CategoryProvider } from "@/contexts/category-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
  icons : {
    icon : '/logo.png'
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
          <CountryProvider>
            <CityProvider>
              <CategoryProvider>
                {children}
              </CategoryProvider>
            </CityProvider>
          </CountryProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
