import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, MapPin, Globe, Building2, GraduationCap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

interface CityPageProps {
  params: Promise<{ slug: string }>
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params
  
  const city = await db.city.findUnique({
    where: {
      slug,
      active: true
    },
    include: {
      country: {
        select: {
          id: true,
          name: true,
          slug: true,
          flagEmoji: true,
        }
      },
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
        take: 6
      }
    }
  })

  if (!city) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/cities">
            <Button variant="ghost" className="text-white hover:bg-blue-400/20 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cities
            </Button>
          </Link>
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                City
              </Badge>
              <div className="flex items-center gap-1 text-blue-100/90 text-sm">
                <Globe className="w-4 h-4" />
                <span>{city.country.flagEmoji} {city.country.name}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-100/90 text-sm">
                <Building2 className="w-4 h-4" />
                <span>{city.colleges.length} Colleges</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {city.name}
            </h1>
          </div>
        </div>
      </section>

      {/* City Image */}
      {city.cityImageURL && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={city.cityImageURL} 
              alt={city.name}
              className="w-full h-96 object-cover"
            />
          </div>
        </section>
      )}

      {/* City Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="shadow-lg border-slate-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">About {city.name}</h2>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {city.description || 'No description available for this city.'}
                  </div>
                </CardContent>
              </Card>

              {/* Colleges in City */}
              {city.colleges.length > 0 && (
                <Card className="shadow-lg border-slate-200">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Colleges in {city.name}</h2>
                      <Link href={`/colleges?city=${city.slug}`}>
                        <Button variant="outline" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {city.colleges.map((college) => (
                        <Link key={college.id} href={`/colleges/${college.slug}`}>
                          <Card className="hover:shadow-xl transition-all cursor-pointer group">
                            <CardContent className="p-6">
                              {/* College Image */}
                              {college.imageURL && (
                                <div className="mb-4 rounded-lg overflow-hidden">
                                  <img 
                                    src={college.imageURL} 
                                    alt={college.name}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}

                              {/* College Header */}
                              <div className="flex items-start gap-4 mb-4">
                                {college.logoURL && (
                                  <img 
                                    src={college.logoURL} 
                                    alt={college.name}
                                    className="w-14 h-14 object-contain rounded-lg bg-white"
                                  />
                                )}
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                                    {college.name}
                                  </h3>
                                  {(college.Countryranking || college.Internationalranking) && (
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                      {college.Countryranking && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          <Star className="w-3 h-3" />
                                          #{college.Countryranking} National
                                        </Badge>
                                      )}
                                      {college.Internationalranking && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
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
                                      <span key={course.slug} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="shadow-lg border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-medium text-slate-900">{city.country.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Total Colleges</p>
                        <p className="font-medium text-slate-900">{city.colleges.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Added</p>
                        <p className="font-medium text-slate-900">
                          {new Date(city.createdAt).toLocaleDateString('en-US', { 
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

              {/* Features */}
              {city.features && city.features.length > 0 && (
                <Card className="shadow-lg border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Key Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {city.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card className="shadow-lg border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Explore More</h3>
                  <div className="space-y-3">
                    <Link href={`/colleges?city=${city.slug}`} className="block">
                      <Button variant="outline" className="w-full">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Browse Colleges
                      </Button>
                    </Link>
                    <Link href={`/countries/${city.country.slug}`} className="block">
                      <Button variant="outline" className="w-full">
                        <Globe className="w-4 h-4 mr-2" />
                        View Country
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
