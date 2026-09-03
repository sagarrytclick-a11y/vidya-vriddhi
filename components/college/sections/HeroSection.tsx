import Image from 'next/image'
import { MapPin, Building2, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollegeActions } from '@/components/college/CollegeActions'

interface HeroSectionProps {
  college: {
    id: string
    name: string
    slug: string
    logoURL: string | null
    imageURL?: string | null
    description: string | null
    establishment_year: number | null
    Countryranking: string | null
    Internationalranking?: string | null
    features?: string[]
    keyHighlights?: unknown
    whyChooseUs?: unknown
    documentsRequired?: unknown
    feesStructure?: unknown
    admissionProcess?: unknown
    campusHighlights?: unknown
    city: { name: string } | null
    country: { name: string } | null
    categories: { id: string; name: string }[]
    courses: { id: string; name?: string }[]
  }
}

export function HeroSection({ college }: HeroSectionProps) {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Breadcrumbs items={[
            { label: 'Colleges', href: '/colleges' },
            ...(college.categories[0]
              ? [{ label: college.categories[0].name, href: `/colleges?category=${encodeURIComponent(college.categories[0].name)}` }]
              : []),
            { label: college.name },
          ]} />
        </div>
      </div>

      <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="h-20 w-20 shrink-0 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:h-24 sm:w-24">
                  {college.logoURL ? (
                    <Image
                      src={college.logoURL}
                      alt={college.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100">
                      <Building2 className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="mb-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                    {college.name}: Admission 2026, Fees, Cut Off, Placements
                  </h1>

                  <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600 sm:gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      {college.city?.name}, {college.country?.name}
                    </span>
                    {college.courses.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        {college.courses.length} Courses
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                      {college.establishment_year ? `Est. ${college.establishment_year}` : 'Established'}
                    </Badge>
                    {college.categories.slice(0, 3).map((cat) => (
                      <Badge key={cat.id} variant="outline" className="bg-white px-3 py-1 text-sm">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CollegeActions college={college} />
          </div>
        </div>
      </div>
    </>
  )
}
