'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  MapPin,
  Building2,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCities } from '@/hooks/useCities'

const PAGE_SIZE = 12

export default function CitiesPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: response, isLoading, error } = useCities({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    active: true,
  })

  const cities = response?.data || []
  const pagination = response?.pagination
  const totalPages = pagination?.totalPages ?? 0
  const total = pagination?.total ?? 0

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Error Loading Cities</h2>
          <p className="text-slate-600">Failed to load cities. Please try again.</p>
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
              Explore <span className="text-amber-100">Cities</span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100/90 leading-relaxed">
              Discover top educational hubs and find colleges in the city that fits your goals.
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
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all"
              />
            </div>
            {!isLoading && total > 0 && (
              <p className="text-sm text-slate-500 shrink-0">
                <span className="font-semibold text-slate-800">{total}</span> cities
                {debouncedSearch ? ' matched' : ' available'}
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
                <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link key={city.id} href={`/cities/${city.slug}`} className="group block h-full">
                  <Card className="h-full overflow-hidden border-slate-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 py-0 gap-0">
                    <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50">
                      {city.cityImageURL ? (
                        <Image
                          src={city.cityImageURL}
                          alt={city.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-orange-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                        <Badge className="bg-white/95 text-slate-800 hover:bg-white border-0 shadow-sm">
                          <Globe className="w-3 h-3 mr-1 text-orange-500" />
                          {city.country.flagEmoji} {city.country.name}
                        </Badge>
                        <Badge className="bg-orange-500 text-white hover:bg-orange-500 border-0 shadow-sm">
                          <Building2 className="w-3 h-3 mr-1" />
                          {city._count.colleges}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col gap-3 flex-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {city.description || `Explore colleges and study options in ${city.name}.`}
                      </p>
                      {city.features?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {city.features.slice(0, 3).map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-orange-50 text-orange-700 border border-orange-100"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {city.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-slate-50 text-slate-600">
                              +{city.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="pt-1 flex items-center text-sm font-semibold text-orange-600 group-hover:gap-2 transition-all">
                        Explore city
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && cities.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-orange-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No cities found</h3>
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

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-12 pt-8 border-t border-orange-100">
              <p className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
                <span className="font-semibold text-slate-800">{totalPages}</span>
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="h-11 px-5 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else if (page <= 4) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i
                    } else {
                      pageNum = page - 3 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          pageNum === page
                            ? 'h-11 w-11 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-xl'
                            : 'h-11 w-11 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl'
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="h-11 px-5 border-slate-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Study Destination</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Browse colleges worldwide or explore countries to plan your next education move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                Browse All Colleges
              </Button>
            </Link>
            <Link href="/countries">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                Explore Countries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
