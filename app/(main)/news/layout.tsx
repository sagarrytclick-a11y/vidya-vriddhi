import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Education News | Latest Updates on Colleges & Exams',
  description: 'Stay updated with the latest education news — exam notifications, admission deadlines, college announcements, and policy changes in Indian education.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'Education News',
    description: 'Latest education news, exam updates, and admission announcements.',
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
