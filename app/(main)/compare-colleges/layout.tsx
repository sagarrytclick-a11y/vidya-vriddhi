import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Colleges in India | Side-by-Side Comparison',
  description:
    'Compare colleges side by side — rankings, fees, courses, placements, and location. Make a smarter admission decision with VidyaVriddhi.',
  alternates: { canonical: '/compare-colleges' },
  openGraph: {
    title: 'Compare Colleges in India',
    description:
      'Side-by-side college comparison for rankings, fees, courses, and placements.',
    url: '/compare-colleges',
  },
}

export default function CompareCollegesLayout({ children }: { children: React.ReactNode }) {
  return children
}
