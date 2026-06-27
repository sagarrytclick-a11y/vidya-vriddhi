import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Education News Article | VidyaVriddhi',
  description: 'Read the latest education news and updates from VidyaVriddhi.',
}

export default function NewsSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
