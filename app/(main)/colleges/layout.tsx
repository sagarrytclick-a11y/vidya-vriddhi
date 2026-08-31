import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colleges in India | Engineering, Medical, Law & More',
  description: 'Browse top colleges in India across all streams — engineering, medical, law, management, and more. Compare courses, fees, placements, and admissions.',
  alternates: { canonical: '/colleges' },
  openGraph: {
    title: 'Top Colleges in India',
    description: 'Find and compare top colleges across India. Get details on courses, fees, rankings, and admissions.',
  },
}

export default function CollegesLayout({ children }: { children: React.ReactNode }) {
  return children
}
