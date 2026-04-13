'use client'

import Link from 'next/link'
import { MapPin, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface College {
  id: string
  name: string
  slug: string
  city?: {
    name: string
  } | null
  categories?: {
    name: string
  }[]
  logoURL?: string | null
}

interface RecommendedCollegesProps {
  colleges: College[]
}

export function RecommendedColleges({ colleges }: RecommendedCollegesProps) {
  if (colleges.length === 0) {
    return null
  }

  return (
    <Card className="bg-white border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
          <Building2 className="w-5 h-5 text-blue-600" />
          Similar Colleges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {colleges.map((college) => (
          <Link
            key={college.id}
            href={`/colleges/${college.slug}`}
            className="flex items-start gap-3 group"
          >
            {/* Logo */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
              {college.logoURL ? (
                <img
                  src={college.logoURL}
                  alt={college.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <Building2 className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {college.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">
                  {college.city?.name || 'India'}
                  {college.categories?.[0] && `, ${college.categories[0].name}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
