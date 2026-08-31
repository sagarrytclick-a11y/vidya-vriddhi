import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online MBA Programs in India | Admissions & University Guide',
  description:
    'Compare Online MBA programs, eligibility, fees, and universities. Get expert counseling for distance and online MBA admissions.',
  alternates: { canonical: '/online-mba' },
  openGraph: {
    title: 'Online MBA Guide',
    description: 'Compare Online MBA programs, fees, eligibility, and top universities in India.',
    url: '/online-mba',
  },
}

export default function OnlineMbaLayout({ children }: { children: React.ReactNode }) {
  return children
}
