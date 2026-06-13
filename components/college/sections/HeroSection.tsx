import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MapPin, GraduationCap, Award, Building2, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CollegeActions } from '@/components/college/CollegeActions'

interface HeroSectionProps {
  college: {
    name: string
    slug: string
    logoURL: string | null
    description: string | null
    establishment_year: number | null
    Countryranking: number | null
    city: { name: string } | null
    country: { name: string } | null
    categories: { id: string; name: string }[]
    courses: { id: string }[]
  }
}

export function HeroSection({ college }: HeroSectionProps) {
  return (
    <>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/colleges" className="hover:text-blue-600 transition-colors">Colleges</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            {college.categories[0] && (
              <>
                <span className="text-blue-600 font-medium">{college.categories[0].name}</span>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            )}
            <span className="text-gray-900 font-medium">{college.name}</span>
          </nav>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-white rounded-lg border p-2 shrink-0">
                  {college.logoURL ? (
                    <Image
                      src={college.logoURL}
                      alt={college.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {college.name}: Admission 2026, Fees, Cut Off, Placements
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {college.city?.name}, {college.country?.name}
                    </span>
                    {college.courses.length > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        {college.courses.length} Courses
                      </span>
                    )}
                    {college.Countryranking && (
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-orange-500" />
                        Rank #{college.Countryranking}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {college.establishment_year ? `Est. ${college.establishment_year}` : 'Established'}
                    </Badge>
                    {college.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat.id} variant="outline" className="text-sm px-3 py-1">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CollegeActions collegeName={college.name} />
          </div>
        </div>
      </div>
    </>
  )
}
