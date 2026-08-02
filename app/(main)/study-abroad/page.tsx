import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, Globe, Building2, Star, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Study Abroad Programs | International Colleges & Universities',
  description: 'Explore study abroad opportunities — international colleges and universities across the globe. Get expert guidance for overseas education, visa support, and admissions.',
  openGraph: {
    title: 'Study Abroad - International Education with VidyaVriddhi',
    description: 'Discover world-class universities and get expert guidance for studying abroad.',
  },
}

export default async function StudyAbroadPage() {
  const colleges = await db.college.findMany({
    where: {
      active: true,
      country: {
        name: {
          not: 'INDIA'
        }
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageURL: true,
      logoURL: true,
      Countryranking: true,
      Internationalranking: true,
      country: {
        select: {
          id: true,
          name: true,
          slug: true,
          flagEmoji: true,
        }
      },
      city: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
      categories: {
        select: {
          name: true,
          slug: true,
        },
        take: 6,
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 24,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Study <span className="text-purple-100">Abroad</span>
            </h1>
            <p className="text-xl text-purple-100/90 max-w-3xl mx-auto leading-relaxed">
              Discover world-class universities and colleges across the globe. Expand your horizons with international education opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white shadow-sm border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{colleges.length}</div>
              <div className="text-sm text-slate-600">International Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(colleges.map(c => c.country.name)).size}
              </div>
              <div className="text-sm text-slate-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(colleges.map(c => c.city.name)).size}
              </div>
              <div className="text-sm text-slate-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {colleges.filter(c => c.Internationalranking).length}
              </div>
              <div className="text-sm text-slate-600">Top Ranked</div>
            </div>
          </div>
        </div>
      </section>

      {/* Colleges Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">International Colleges</h2>
          
          {colleges.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No international colleges found</h3>
                <p className="text-slate-600">
                  Check back soon as we add more international institutions to our database.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <Card key={college.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* College Image */}
                      {college.imageURL && (
                        <div className="mb-4 rounded-lg overflow-hidden relative h-48">
                          <Image 
                            src={college.imageURL} 
                            alt={college.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      {/* College Header */}
                      <div className="flex items-start gap-3">
                      {college.logoURL && (
                        <div className="relative w-12 h-12 shrink-0">
                          <Image 
                            src={college.logoURL} 
                            alt={college.name}
                            fill
                            className="object-contain rounded-lg bg-white"
                            sizes="48px"
                          />
                        </div>
                      )}
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-1">
                            {college.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Globe className="w-3 h-3" />
                            <span>{college.country.flagEmoji} {college.country.name}</span>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{college.city.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rankings */}
                      {(college.Countryranking || college.Internationalranking) && (
                        <div className="flex flex-wrap gap-2">
                          {college.Countryranking && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              #{college.Countryranking} National
                            </Badge>
                          )}
                          {college.Internationalranking && (
                            <Badge className="flex items-center gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                              <Star className="w-3 h-3" />
                              #{college.Internationalranking} International
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Description */}
                      {college.description && (
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {college.description}
                        </p>
                      )}

                      {/* Categories */}
                      {college.categories && college.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
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

                      {/* View Details Button */}
                      <Link href={`/colleges/${college.slug}`}>
                        <Button variant="outline" className="w-full border-slate-300 hover:border-purple-500 hover:bg-purple-50 hover:text-purple-600 transition-all">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your International Education Journey
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Get personalized guidance for studying abroad. Our experts help you find the perfect college and navigate the application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
              Get Free Consultation
            </Button>
            <Link href="/colleges">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                Browse All Colleges
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
