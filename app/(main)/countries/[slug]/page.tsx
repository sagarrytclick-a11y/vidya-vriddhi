import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Globe,
  Building2,
  GraduationCap,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { db } from '@/lib/db'

interface CountryPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

async function getCountryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return db.country.findFirst({
        where: { slug, active: true },
        select: {
          id: true,
          name: true,
          slug: true,
          flagEmoji: true,
          description: true,
          createdAt: true,
          _count: {
            select: {
              colleges: { where: { active: true } },
              cities: { where: { active: true } },
            },
          },
          colleges: {
            where: { active: true },
            take: 8,
            orderBy: { Internationalranking: 'asc' },
            select: {
              id: true,
              name: true,
              slug: true,
              logoURL: true,
              imageURL: true,
              description: true,
              establishment_year: true,
              Countryranking: true,
              Internationalranking: true,
              city: { select: { name: true, slug: true } },
              categories: { select: { name: true, slug: true }, take: 3 },
              courses: { select: { name: true, slug: true }, take: 3 },
              _count: { select: { courses: true } },
            },
          },
          cities: {
            where: { active: true },
            take: 6,
            orderBy: { name: 'asc' },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              cityImageURL: true,
              _count: { select: { colleges: true } },
            },
          },
        },
      })
    },
    ['country-detail', slug],
    { revalidate: 3600 }
  )()
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params
  const country = await getCountryBySlug(slug)
  if (!country) return { title: 'Country Not Found' }
  return {
    title: `Study in ${country.name} | Colleges, Courses & Universities`,
    description:
      country.description?.slice(0, 160) ||
      `Explore educational opportunities in ${country.name}. Find top colleges, courses, and admission guidance.`,
    alternates: { canonical: `/countries/${slug}` },
    openGraph: {
      title: `Study in ${country.name}`,
      description: country.description?.slice(0, 160),
      url: `/countries/${slug}`,
    },
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params
  const country = await getCountryBySlug(slug)

  if (!country) {
    notFound()
  }

  const collegeTotal = country._count.colleges
  const cityTotal = country._count.cities

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/25 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[380px] md:min-h-[440px]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-orange-900/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col justify-end min-h-[380px] md:min-h-[440px]">
          <Link href="/countries" className="w-fit mb-4">
            <Button
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Countries
            </Button>
          </Link>

          <Breadcrumbs
            dark
            items={[
              { label: 'Countries', href: '/countries' },
              { label: country.name },
            ]}
          />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl text-6xl sm:text-7xl shrink-0">
              {country.flagEmoji || <Globe className="w-12 h-12 text-white" />}
            </div>

            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white text-orange-700 border-0 hover:bg-white">
                  Study Destination
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-sm text-white">
                  <Building2 className="w-3.5 h-3.5" />
                  {collegeTotal} Colleges
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-sm text-white">
                  <MapPin className="w-3.5 h-3.5" />
                  {cityTotal} Cities
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Study in {country.name}
              </h1>

              {country.description && (
                <p className="text-lg text-white/85 leading-relaxed line-clamp-3 md:line-clamp-2">
                  {country.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/colleges">
                  <Button
                    size="lg"
                    className="bg-white text-orange-700 hover:bg-orange-50 font-semibold shadow-lg"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Browse Colleges
                  </Button>
                </Link>
                <Link href="/cities">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm"
                  >
                    Explore Cities
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="border-slate-200/80 shadow-sm overflow-hidden py-0 gap-0">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">About {country.name}</h2>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {country.description ||
                      `${country.name} is a popular study destination. Explore colleges, cities, and programs available here.`}
                  </div>
                </CardContent>
              </Card>

              {/* Cities */}
              <div className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Cities in {country.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {cityTotal > 0
                        ? `Showing ${Math.min(6, cityTotal)} of ${cityTotal} cities`
                        : 'No cities listed yet'}
                    </p>
                  </div>
                  {cityTotal > 0 && (
                    <Link href="/cities">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      >
                        View all
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>

                {country.cities.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {country.cities.map((city) => (
                      <Link
                        key={city.id}
                        href={`/cities/${city.slug}`}
                        className="group block h-full"
                      >
                        <Card className="h-full overflow-hidden border-slate-200/80 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 py-0 gap-0">
                          <div className="relative h-36 bg-gradient-to-br from-orange-50 to-amber-50">
                            {city.cityImageURL ? (
                              <Image
                                src={city.cityImageURL}
                                alt={city.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin className="w-10 h-10 text-orange-200" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <h3 className="font-bold text-white drop-shadow">{city.name}</h3>
                              <Badge className="bg-orange-500 text-white border-0 hover:bg-orange-500">
                                {city._count.colleges}
                              </Badge>
                            </div>
                          </div>
                          {city.description && (
                            <CardContent className="p-4">
                              <p className="text-slate-600 text-sm line-clamp-2">{city.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-slate-200 bg-slate-50/50">
                    <CardContent className="p-8 text-center">
                      <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">Cities for this country will appear here soon.</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Colleges */}
              <div className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Colleges in {country.name}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {collegeTotal > 0
                        ? `Showing ${Math.min(8, collegeTotal)} of ${collegeTotal} colleges`
                        : 'No colleges listed yet'}
                    </p>
                  </div>
                  {collegeTotal > 0 && (
                    <Link href="/colleges">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
                      >
                        View all
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>

                {country.colleges.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    {country.colleges.map((college) => (
                      <Link
                        key={college.id}
                        href={`/colleges/${college.slug}`}
                        className="group block h-full"
                      >
                        <Card className="h-full overflow-hidden border-slate-200/80 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 py-0 gap-0">
                          <div className="relative h-40 bg-gradient-to-br from-orange-50 to-amber-50">
                            {college.imageURL ? (
                              <Image
                                src={college.imageURL}
                                alt={college.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-orange-200" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3 mb-3">
                              {college.logoURL && (
                                <div className="relative w-12 h-12 shrink-0 rounded-lg bg-white border border-slate-100 overflow-hidden">
                                  <Image
                                    src={college.logoURL}
                                    alt={college.name}
                                    fill
                                    className="object-contain p-1"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                                  {college.name}
                                </h3>
                                {college.city && (
                                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                    <MapPin className="w-3 h-3 text-orange-500" />
                                    <span>{college.city.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {college.establishment_year && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-orange-50 text-orange-700 border border-orange-100"
                                >
                                  Est. {college.establishment_year}
                                </Badge>
                                {college._count?.courses > 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-slate-50 text-slate-700 border border-slate-100"
                                  >
                                    {college._count.courses} Courses
                                  </Badge>
                                )}
                              </div>
                            )}

                            {college.description && (
                              <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                {college.description}
                              </p>
                            )}

                            {college.categories?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {college.categories.slice(0, 3).map((category) => (
                                  <Badge
                                    key={category.slug}
                                    variant="outline"
                                    className="text-xs border-slate-200"
                                  >
                                    {category.name}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {college.courses?.length > 0 && (
                              <div className="border-t border-slate-100 pt-3">
                                <p className="text-xs text-slate-500 mb-2">Popular courses</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {college.courses.map((course) => (
                                    <span
                                      key={course.slug}
                                      className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-md"
                                    >
                                      {course.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed border-slate-200 bg-slate-50/50">
                    <CardContent className="p-8 text-center">
                      <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">
                        Colleges for this country will appear here soon.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-orange-100 shadow-sm overflow-hidden py-0 gap-0">
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 px-6 py-5 text-white">
                  <p className="text-orange-100 text-sm font-medium mb-1">Quick info</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{country.flagEmoji || '🌍'}</span>
                    <h3 className="text-xl font-bold">{country.name}</h3>
                  </div>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Colleges</p>
                      <p className="font-semibold text-slate-900">{collegeTotal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Cities</p>
                      <p className="font-semibold text-slate-900">{cityTotal}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 shadow-sm py-0 gap-0">
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900">Explore more</h3>
                  <Link href="/colleges" className="block">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Browse Colleges
                    </Button>
                  </Link>
                  <Link href="/cities" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Browse Cities
                    </Button>
                  </Link>
                  <Link href="/countries" className="block">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      All Countries
                    </Button>
                  </Link>
                  <Link href="/study-abroad" className="block">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600 hover:text-orange-700 hover:bg-orange-50"
                    >
                      Study Abroad Guide
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
