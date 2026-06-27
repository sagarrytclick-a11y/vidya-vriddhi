import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, Clock, ArrowLeft, MapPin, Globe, Building2, GraduationCap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { db } from '@/lib/db'

interface CountryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { slug } = await params
  const country = await db.country.findUnique({ where: { slug, active: true }, select: { name: true, description: true } })
  if (!country) return { title: 'Country Not Found' }
  return {
    title: `Study in ${country.name} | Colleges, Courses & Universities`,
    description: country.description?.slice(0, 160) || `Explore educational opportunities in ${country.name}. Find top colleges, courses, and admission guidance.`,
    openGraph: {
      title: `Study in ${country.name} - VidyaVriddhi`,
      description: country.description?.slice(0, 160),
    },
  }
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { slug } = await params
  
  const country = await db.country.findUnique({
    where: {
      slug,
      active: true
    },
    include: {
      colleges: {
        where: {
          active: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
          imageURL: true,
          description: true,
          Countryranking: true,
          Internationalranking: true,
          city: {
            select: {
              name: true,
              slug: true,
            }
          },
          categories: {
            select: {
              name: true,
              slug: true,
            }
          },
          courses: {
            select: {
              name: true,
              slug: true,
            },
            take: 3
          }
        },
        orderBy: {
          Internationalranking: 'asc'
        }
      },
      cities: {
        where: {
          active: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          cityImageURL: true,
          _count: {
            select: {
              colleges: true
            }
          }
        },
        take: 6
      }
    }
  })

  if (!country) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/countries">
            <Button variant="ghost" className="text-white hover:bg-green-400/20 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Countries
            </Button>
          </Link>
          <Breadcrumbs dark items={[
            { label: 'Countries', href: '/countries' },
            { label: country.name },
          ]} />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-7xl">
                {country.flagEmoji || <Globe className="w-16 h-16" />}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {country.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-green-100/90">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{country.colleges.length} Colleges</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{country.cities.length} Cities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {country.description && (
                <Card className="shadow-lg border-slate-200">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">About {country.name}</h2>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {country.description}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Colleges in Country */}
              {country.colleges.length > 0 && (
                <Card className="shadow-lg border-slate-200">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Colleges in {country.name}</h2>
                      <Link href={`/colleges?country=${country.slug}`}>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {country.colleges.map((college) => (
                        <Link key={college.id} href={`/colleges/${college.slug}`}>
                          <Card className="hover:shadow-xl transition-all cursor-pointer group">
                            <CardContent className="p-6">
                              {/* College Image */}
                              {college.imageURL && (
                                <div className="mb-4 rounded-lg overflow-hidden relative h-40">
                                  <Image 
                                    src={college.imageURL} 
                                    alt={college.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                  />
                                </div>
                              )}

                              {/* College Header */}
                              <div className="flex items-start gap-4 mb-4">
                                {college.logoURL && (
                                  <div className="relative w-14 h-14 shrink-0">
                                    <Image 
                                      src={college.logoURL} 
                                      alt={college.name}
                                      fill
                                      className="object-contain rounded-lg bg-white"
                                      sizes="56px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-2">
                                    {college.name}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>{college.city.name}</span>
                                  </div>
                                  {(college.Countryranking || college.Internationalranking) && (
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                      {college.Countryranking && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          <Star className="w-3 h-3" />
                                          #{college.Countryranking} National
                                        </Badge>
                                      )}
                                      {college.Internationalranking && (
                                        <Badge className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-200">
                                          <Star className="w-3 h-3" />
                                          #{college.Internationalranking} International
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* College Description */}
                              {college.description && (
                                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                  {college.description}
                                </p>
                              )}

                              {/* Categories */}
                              {college.categories && college.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {college.categories.slice(0, 3).map((category) => (
                                    <Badge key={category.slug} variant="outline" className="text-xs">
                                      {category.name}
                                    </Badge>
                                  ))}
                                  {college.categories.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{college.categories.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Courses */}
                              {college.courses && college.courses.length > 0 && (
                                <div className="border-t border-slate-100 pt-3">
                                  <p className="text-xs text-slate-500 mb-2">Popular Courses:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {college.courses.map((course) => (
                                      <span key={course.slug} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
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
                  </CardContent>
                </Card>
              )}

              {/* Cities in Country */}
              {country.cities.length > 0 && (
                <Card className="shadow-lg border-slate-200">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Cities in {country.name}</h2>
                      <Link href={`/cities?country=${country.slug}`}>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {country.cities.map((city) => (
                        <Link key={city.id} href={`/cities/${city.slug}`}>
                          <Card className="hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {city.cityImageURL && (
                                  <div className="rounded-lg overflow-hidden relative h-32">
                                    <Image 
                                      src={city.cityImageURL} 
                                      alt={city.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-semibold text-slate-900 mb-1">
                                    {city.name}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Building2 className="w-3 h-3" />
                                    <span>{city._count.colleges} Colleges</span>
                                  </div>
                                  {city.description && (
                                    <p className="text-slate-600 text-sm line-clamp-2 mt-2">
                                      {city.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
              {/* Quick Info */}
              <Card className="shadow-lg border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-500">Total Colleges</p>
                        <p className="font-medium text-slate-900">{country.colleges.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-500">Total Cities</p>
                        <p className="font-medium text-slate-900">{country.cities.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-slate-500">Added</p>
                        <p className="font-medium text-slate-900">
                          {new Date(country.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="shadow-lg border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Explore More</h3>
                  <div className="space-y-3">
                    <Link href={`/colleges?country=${country.slug}`} className="block">
                      <Button variant="outline" className="w-full">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Browse Colleges
                      </Button>
                    </Link>
                    <Link href={`/cities?country=${country.slug}`} className="block">
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Browse Cities
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
