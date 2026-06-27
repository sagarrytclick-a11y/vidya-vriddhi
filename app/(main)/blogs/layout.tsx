import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blogs | Education Insights & Career Guidance',
  description: 'Read expert blogs on college admissions, exam preparation, career guidance, study abroad tips, and educational insights from VidyaVriddhi.',
  openGraph: {
    title: 'VidyaVriddhi Blogs - Education & Career Insights',
    description: 'Expert articles on college admissions, exam prep, and career guidance.',
  },
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children
}
