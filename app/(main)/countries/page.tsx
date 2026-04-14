'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Globe, Building2, MapPin, ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCountries } from '@/hooks/useCountries'

export default function CountriesPage() {
  const { data: countries, isLoading, error } = useCountries(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = (countries || []).filter(country => {
    const matchesSearch = searchTerm === '' || 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Countries</h2>
          <p className="text-slate-600">Failed to load countries. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-green-100">Countries</span>
            </h1>
            <p className="text-xl text-green-100/90 max-w-3xl mx-auto leading-relaxed">
              Discover educational opportunities across different countries and find your perfect study destination
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
                  placeholder="Search countries by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
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

          {/* Countries List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map((country) => (
              <Card key={country.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Country Flag */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-6xl">
                        {country.flagEmoji || <Globe className="w-16 h-16 text-slate-300" />}
                      </div>
                    </div>

                    {/* Country Name */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors mb-2">
                        {country.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <Building2 className="w-4 h-4" />
                        <span>{country._count.colleges} Colleges</span>
                      </div>
                    </div>

                    {/* Country Description */}
                    {country.description && (
                      <p className="text-slate-600 text-sm leading-relaxed text-center line-clamp-3">
                        {country.description}
                      </p>
                    )}

                    {/* Country Actions */}
                    <div className="flex gap-3">
                      <Link href={`/countries/${country.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full border-slate-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all">
                          Explore
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
          {!isLoading && filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No countries found</h3>
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
            Explore countries worldwide and discover the best colleges and universities for your education journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold">
              Browse All Colleges
            </Button>
            <Link href="/study-abroad">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                Study Abroad
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
