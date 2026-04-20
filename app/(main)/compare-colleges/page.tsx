'use client'

import { useState, useEffect } from 'react'
import { X, Plus, ArrowRight, MapPin, Star, GraduationCap, FileText, IndianRupee, CheckCircle, Calendar, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface College {
  id: string
  name: string
  slug: string
  description?: string
  logoURL?: string
  establishment_year?: number
  Countryranking?: number
  Internationalranking?: number
  features: string[]
  keyHighlights?: {
    title: string
    features: string[]
    description: string
  }
  whyChooseUs?: {
    title: string
    features: {
      title: string
      description: string
    }[]
    description: string
  }
  documentsRequired?: {
    title: string
    documents: string[]
    description: string
  }
  feesStructure?: {
    title: string
    courses: {
      course_name: string
      duration: string
      annual_tuition_fee: string
    }[]
    description: string
  }
  admissionProcess?: {
    title: string
    steps: string[]
    description: string
  }
  campusHighlights?: {
    title: string
    highlights: string[]
    description: string
  }
  city?: {
    name: string
    state?: {
      name: string
    }
  }
  country?: {
    name: string
  }
  categories?: Array<{
    name: string
  }>
  courses?: Array<{
    name: string
  }>
}

export default function CompareCollegesPage() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFullCollegeData = async () => {
      setLoading(true)
      try {
        const stored = localStorage.getItem('compareColleges')
        if (!stored) {
          setSelectedColleges([])
          setLoading(false)
          return
        }

        const storedItems = JSON.parse(stored) as College[]
        if (storedItems.length === 0) {
          setSelectedColleges([])
          setLoading(false)
          return
        }

        // Fetch full data for each ID to ensure we have all nested objects (fees, process, etc.)
        const fullDataPromises = storedItems.map(item => 
          fetch(`/api/colleges/${item.id}`).then(res => res.json())
        )
        
        const results = await Promise.all(fullDataPromises)
        // Filter out any failed fetches and update state
        setSelectedColleges(results.filter(c => c && c.id))
      } catch (error) {
        console.error("Failed to fetch comparison data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFullCollegeData()
  }, [])

  const removeCollege = (collegeId: string) => {
    const updated = selectedColleges.filter(college => college.id !== collegeId)
    setSelectedColleges(updated)
    localStorage.setItem('compareColleges', JSON.stringify(updated))
  }

  const clearAll = () => {
    setSelectedColleges([])
    localStorage.removeItem('compareColleges')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Fetching Comparison Data...</p>
        </div>
      </div>
    )
  }

  if (selectedColleges.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Compare Colleges</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select colleges from the colleges page to start comparing their features, fees, placements, and more.
            </p>
            <Link 
              href="/colleges"
              className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Browse Colleges</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
              <p className="text-gray-600 mt-1">
                Comparing {selectedColleges.length} college{selectedColleges.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedColleges.length < 4 && (
                <Link
                  href="/colleges"
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add College</span>
                </Link>
              )}
              <button
                onClick={clearAll}
                className="text-gray-500 hover:text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-6 font-bold text-gray-900 bg-gray-50/50 w-64">Criteria</th>
                  {selectedColleges.map((college) => (
                    <th key={college.id} className="text-left p-6 font-bold text-gray-900 bg-gray-50/50 min-w-[300px] border-l border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-2">{college.name}</span>
                        <button
                          onClick={() => removeCollege(college.id)}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Visual Header Row */}
                <tr>
                  <td className="p-6 font-semibold text-gray-700 bg-gray-50/30">Preview</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="relative w-20 h-20 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center p-2">
                          {college.logoURL ? (
                            <Image
                              src={college.logoURL}
                              alt={college.name}
                              fill
                              className="object-contain p-2"
                            />
                          ) : (
                            <GraduationCap className="w-10 h-10 text-gray-300" />
                          )}
                        </div>
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="text-orange-500 hover:underline text-sm font-bold"
                        >
                          View Official Profile
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Key Stats Row */}
                <tr>
                  <td className="p-6 font-semibold text-gray-700 bg-gray-50/30">Overview</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                          {college.city?.name}, {college.city?.state?.name || college.country?.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                          Established {college.establishment_year || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 font-bold">
                          <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                          Rank: #{college.Countryranking || 'NR'} (India)
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Fees - Re-calculated for accuracy */}
                <tr>
                  <td className="p-6 font-semibold text-gray-700 bg-gray-50/30">Fee Structure</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      {college.feesStructure?.courses?.length ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <span className="text-xs uppercase tracking-wider text-orange-600 font-bold">Average Annual Fee</span>
                            <div className="text-xl font-black text-gray-900">
                              {(() => {
                                const fees = college.feesStructure?.courses?.map(c => {
                                  const match = c.annual_tuition_fee.match(/[\d,]+/)
                                  return match ? parseInt(match[0].replace(/,/g, '')) : 0
                                }).filter(f => f > 0) || []
                                const avg = fees.length > 0 ? Math.round(fees.reduce((a, b) => a + b, 0) / fees.length) : 0
                                return avg > 0 ? `₹${avg.toLocaleString('en-IN')}` : 'Contact for Fees'
                              })()}
                            </div>
                          </div>
                          <div className="space-y-1">
                            {college.feesStructure.courses.slice(0, 2).map((c, i) => (
                              <div key={i} className="text-xs flex justify-between border-b border-gray-50 pb-1">
                                <span className="text-gray-500 truncate max-w-[150px]">{c.course_name}</span>
                                <span className="font-semibold text-gray-700">{c.annual_tuition_fee}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Not Disclosed</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Facilities / Highlights */}
                <tr>
                  <td className="p-6 font-semibold text-gray-700 bg-gray-50/30">Top Facilities</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {(college.features || college.campusHighlights?.highlights || []).slice(0, 5).map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Admission Process */}
                <tr>
                  <td className="p-6 font-semibold text-gray-700 bg-gray-50/30">Admission Info</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      {college.admissionProcess?.steps?.length ? (
                        <ul className="space-y-2">
                          {college.admissionProcess.steps.slice(0, 3).map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                              <div className="w-4 h-4 bg-green-100 text-green-700 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                                {i + 1}
                              </div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Step-by-step guide available on profile</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Final CTA */}
                <tr>
                  <td className="p-6 bg-gray-50/30"></td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-6 border-l border-gray-100">
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-xl font-bold transition-all shadow-md shadow-orange-200"
                      >
                        Apply Now
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}