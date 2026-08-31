import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses in India | Undergraduate, Postgraduate & Professional',
  description: 'Explore 1000+ courses in India — engineering, medical, MBA, law, arts, science, and more. Get detailed information on curriculum, colleges, and career prospects.',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: 'Courses in India',
    description: 'Discover undergraduate, postgraduate, and professional courses across top colleges in India.',
  },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children
}
