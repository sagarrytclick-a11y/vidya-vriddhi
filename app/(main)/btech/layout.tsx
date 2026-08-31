import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B.Tech Admissions 2026 | Engineering Colleges & Counseling',
  description:
    'Explore B.Tech colleges, entrance exams, fees, and admission guidance. Get expert counseling for engineering admissions across India.',
  alternates: { canonical: '/btech' },
  openGraph: {
    title: 'B.Tech Admissions Guide',
    description: 'Engineering colleges, exams, fees, and admission counseling for B.Tech aspirants.',
    url: '/btech',
  },
}

export default function BtechLayout({ children }: { children: React.ReactNode }) {
  return children
}
