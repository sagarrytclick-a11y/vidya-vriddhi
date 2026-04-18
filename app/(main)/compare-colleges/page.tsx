'use client'

import { useState, useEffect } from 'react'
import { X, Plus, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface College {
  id: string
  name: string
  slug: string
  logo: string
  city: string
  state: string
  fees: string
  rating: number
  placement: string
  courses: string[]
  category: string
}

export default function CompareCollegesPage() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load selected colleges from localStorage
    const stored = localStorage.getItem('compareColleges')
    if (stored) {
      setSelectedColleges(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever selection changes
    localStorage.setItem('compareColleges', JSON.stringify(selectedColleges))
  }, [selectedColleges])

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(prev => prev.filter(college => college.id !== collegeId))
  }

  const addMoreColleges = () => {
    // Navigate to colleges page or show modal to add more
    window.location.href = '/colleges'
  }

  const clearAll = () => {
    setSelectedColleges([])
    localStorage.removeItem('compareColleges')
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
              <p className="text-gray-600 mt-1">
                Comparing {selectedColleges.length} college{selectedColleges.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedColleges.length < 4 && (
                <button
                  onClick={addMoreColleges}
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add College</span>
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900 bg-gray-50 w-48">Feature</th>
                  {selectedColleges.map((college) => (
                    <th key={college.id} className="text-left p-4 font-semibold text-gray-900 bg-gray-50 min-w-[250px]">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{college.name}</span>
                        <button
                          onClick={() => removeCollege(college.id)}
                          className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* College Logo */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Logo</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={college.logo}
                          alt={college.name}
                          width={60}
                          height={60}
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Location */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Location</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4 text-gray-900">
                      {college.city}, {college.state}
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Category</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4 text-gray-900">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {college.category}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Rating</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-gray-900">{college.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Fees */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Annual Fees</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <span className="text-lg font-semibold text-gray-900">{college.fees}</span>
                    </td>
                  ))}
                </tr>

                {/* Placement */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Highest Package</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <span className="text-green-600 font-semibold">{college.placement}</span>
                    </td>
                  ))}
                </tr>

                {/* Courses */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">Popular Courses</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <div className="space-y-2">
                        {college.courses.slice(0, 3).map((course, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {course}
                          </div>
                        ))}
                        {college.courses.length > 3 && (
                          <div className="text-sm text-orange-500 font-medium">
                            +{college.courses.length - 3} more
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 font-medium text-gray-700">Actions</td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="p-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => removeCollege(college.id)}
                          className="px-3 py-2 border border-gray-300 hover:border-red-300 hover:text-red-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add More CTA */}
        {selectedColleges.length < 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={addMoreColleges}
              className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add More Colleges</span>
            </button>
            <p className="text-gray-500 text-sm mt-2">
              You can compare up to 4 colleges at a time
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
