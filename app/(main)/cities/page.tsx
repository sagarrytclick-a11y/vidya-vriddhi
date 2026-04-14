'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Building2, Globe, ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCities } from '@/hooks/useCities'

export default function CitiesPage() {
  const { data: cities, isLoading, error } = useCities(100)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCities = (cities || []).filter(city => {
    const matchesSearch = searchTerm === '' || 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  }) || []

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Cities</h2>
          <p className="text-slate-600">Failed to load cities. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-blue-100">Cities</span> Worldwide
            </h1>
            <p className="text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed">
              Discover top educational destinations and find your perfect study location
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cities, countries, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
                      <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cities List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <Card key={city.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* City Image */}
                    {city.cityImageURL && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={city.cityImageURL} 
                          alt={city.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* City Meta */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                          {city.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-slate-500">•</span>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Globe className="w-3 h-3" />
                            <span>{city.country.flagEmoji} {city.country.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* City Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {city.description || 'No description available'}
                    </p>

                    {/* Features */}
                    {city.features && city.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {city.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {city.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{city.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* College Count */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                      <Building2 className="w-4 h-4" />
                      <span>{city._count.colleges} Colleges</span>
                    </div>

                    {/* City Actions */}
                    <div className="flex gap-3">
                      <Link href={`/cities/${city.slug}`}>
                        <Button variant="outline" className="flex-1 border-slate-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                          Explore City
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {!isLoading && filteredCities.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No cities found</h3>
                <p className="text-slate-600">
                  Try adjusting your search to find what you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find Your Perfect Study Destination
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Explore cities worldwide and discover the best colleges and universities for your education journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white font-bold">
              Browse All Colleges
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Explore Countries
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
