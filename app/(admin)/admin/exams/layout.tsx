import { ExamProvider } from '@/contexts/exam-context'

export default function ExamsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ExamProvider>{children}</ExamProvider>
}
