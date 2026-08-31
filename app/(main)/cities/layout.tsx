import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top College Cities | Study Destinations in India & Abroad',
  description: 'Explore college cities across India and the world. Find the best cities for education with top colleges, universities, and student life.',
  alternates: { canonical: '/cities' },
  openGraph: {
    title: 'College Cities',
    description: 'Discover top educational destinations and find your perfect study location.',
  },
}

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
