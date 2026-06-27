import { NewsProvider } from '@/contexts/news-context'

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <NewsProvider>{children}</NewsProvider>
}
