'use client'

import { Calendar, ExternalLink, Newspaper } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NewsSidebarProps {
  collegeName: string
}

// Static news data - in production this would come from an API
const getNewsItems = (collegeName: string) => [
  {
    id: 1,
    title: `${collegeName.split(' ')[0]} ${collegeName.split(' ')[1] || ''} MBA Admission 2026: Eligibility, Fees, Process`,
    date: '9 Apr, 2026',
    author: 'Arman Kumar',
  },
  {
    id: 2,
    title: `${collegeName.split(' ')[0]} Awards 629 Degrees at 61st Convocation`,
    date: '31 Mar, 2026',
    author: 'Arman Kumar',
  },
  {
    id: 3,
    title: `${collegeName.split(' ')[0]} Opens Admissions 2026 for Global General Management Programme`,
    date: '23 Jan, 2026',
    author: 'Arman Kumar',
  },
  {
    id: 4,
    title: `${collegeName.split(' ')[0]} First Placement Cluster 2026: BCG Tops Recruiters`,
    date: '4 Feb, 2026',
    author: 'Disha Yadav',
  },
  {
    id: 5,
    title: `${collegeName.split(' ')[0]} PGP Final Placements 2025-26 to Begin in 3 Feb`,
    date: '27 Jan, 2026',
    author: 'Arman Kumar',
  },
]

export function NewsSidebar({ collegeName }: NewsSidebarProps) {
  const newsItems = getNewsItems(collegeName)

  return (
    <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Newspaper className="w-5 h-5 text-blue-600" />
          News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsItems.map((news) => (
          <div key={news.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors line-clamp-2 font-medium"
            >
              {news.title}
            </a>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{news.date}</span>
              <span className="text-blue-600">• {news.author}</span>
            </div>
          </div>
        ))}

        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1 mt-2 font-medium">
          View All News
          <ExternalLink className="w-3 h-3" />
        </button>
      </CardContent>
    </Card>
  )
}
