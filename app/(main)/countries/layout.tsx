import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Study Destinations by Country | Colleges & Universities',
  description: 'Explore countries and find the best study destinations for your education. Compare colleges, courses, and opportunities across nations worldwide.',
  alternates: { canonical: '/countries' },
  openGraph: {
    title: 'Countries for Study',
    description: 'Discover educational opportunities across countries and find your perfect study destination.',
  },
}

export default function CountriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
