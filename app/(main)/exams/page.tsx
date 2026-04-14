import { Metadata } from 'next'
import { db } from '@/lib/db'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { ChevronRight } from 'lucide-react'
import ExamsListClient from '@/components/exam/ExamsListClient'

export const metadata: Metadata = {
  title: 'Entrance Exams 2026 | Engineering, Medical, Law | Vidya Vriddhi',
  description: 'Explore all entrance exams in India - JEE, NEET, CAT, GATE, CLAT, and more. Get exam dates, syllabus, registration details, and preparation tips.',
}

export const revalidate = 3600

const getExams = unstable_cache(
  async () => {
    const exams = await db.exam.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        description: true,
        conductingBody: true,
        examMode: true,
        examType: true,
        frequency: true,
        examImageurl: true,
        examDates: true,
        examPattern: true,
        resultStatistics: true,
        createdAt: true,
      }
    })
    return exams
  },
  ['exams-list'],
  { revalidate: 3600 }
)

export default async function ExamsPage() {
  const exams = await getExams()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-600 py-3">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Exams</span>
          </nav>
        </div>
      </div>

      {/* Main Content - Client Component for instant filtering */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ExamsListClient exams={exams} />
      </div>
    </div>
  )
}
