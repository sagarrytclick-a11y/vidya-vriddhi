'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Globe,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCountries } from '@/hooks/useCountries'

export default function CountriesPage() {
  const { data: countries, isLoading, error } = useCountries({
    excludeIndia: false,
    active: true,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = (countries || []).filter((country) => {
    if (searchTerm === '') return true
    const q = searchTerm.toLowerCase()
    return (
      country.name.toLowerCase().includes(q) ||
      country.description?.toLowerCase().includes(q)
    )
  })

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Countries</h2>
          <p className="text-slate-600">Failed to load countries. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Study destinations worldwide</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Explore <span className="text-amber-100">Countries</span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100/90 leading-relaxed">
              Discover educational opportunities abroad and find the right country for your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search countries by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all"
              />
            </div>
            {!isLoading && filteredCountries.length > 0 && (
              <p className="text-sm text-slate-500 shrink-0">
                <span className="font-semibold text-slate-800">{filteredCountries.length}</span>{' '}
                {filteredCountries.length === 1 ? 'country' : 'countries'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white overflow-hidden"
                >
                  <div className="h-40 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-2/3 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCountries.map((country) => (
                <Link
                  key={country.id}
                  href={`/countries/${country.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 py-0 gap-0">
                    <div className="relative h-40 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 flex items-center justify-center">
                      <div className="text-7xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {country.flagEmoji || (
                          <Globe className="w-16 h-16 text-orange-300" />
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <Badge className="bg-white/95 text-slate-800 hover:bg-white border-0 shadow-sm">
                          <Building2 className="w-3 h-3 mr-1 text-orange-500" />
                          {country._count.colleges} Colleges
                        </Badge>
                        {typeof country._count.cities === 'number' && (
                          <Badge className="bg-orange-500 text-white hover:bg-orange-500 border-0 shadow-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {country._count.cities}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col gap-3 flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {country.description ||
                          `Explore colleges, cities, and study options in ${country.name}.`}
                      </p>
                      <div className="pt-1 flex items-center text-sm font-semibold text-orange-600">
                        Explore country
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && filteredCountries.length === 0 && (
            <div className="text-center py-16">
              <Globe className="w-12 h-12 text-orange-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No countries found</h3>
              <p className="text-slate-600 mb-6">Try a different search term.</p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Study Destination</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Browse colleges worldwide or explore cities to plan your next education move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                Browse All Colleges
              </Button>
            </Link>
            <Link href="/study-abroad">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                Study Abroad
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
