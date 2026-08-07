'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AdminPageHeader,
  adminPagePadClass,
  adminCardClass,
} from '@/components/admin/page-ui'

interface TableData {
  countries: any[]
  cities: any[]
  colleges: any[]
  categories: any[]
  exams: any[]
  courses: any[]
  counts: {
    countries: number
    cities: number
    colleges: number
    categories: number
    exams: number
    courses: number
  }
}

export default function DatabaseTables() {
  const [data, setData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/admin/tables')
      const tablesData = await response.json()
      setData(tablesData)
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables)
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName)
    } else {
      newExpanded.add(tableName)
    }
    setExpandedTables(newExpanded)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading database tables...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">Failed to load database tables</div>
      </div>
    )
  }

  return (
    <div className={`${adminPagePadClass} space-y-6`}>
      <AdminPageHeader
        title="Database Tables"
        action={
          <Button onClick={fetchTables} variant="outline">
            Refresh
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.countries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.cities}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.colleges}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.categories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.exams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.courses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Data */}
      <div className="space-y-4">
        {/* Countries Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Countries ({data.countries.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTable('countries')}
              >
                {expandedTables.has('countries') ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {expandedTables.has('countries') && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Cities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.countries.map((country) => (
                      <tr key={country.id}>
                        <td className="border p-2">{country.id}</td>
                        <td className="border p-2">{country.name}</td>
                        <td className="border p-2">{country.cities?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Cities Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cities ({data.cities.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTable('cities')}
              >
                {expandedTables.has('cities') ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {expandedTables.has('cities') && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cities.map((city) => (
                      <tr key={city.id}>
                        <td className="border p-2">{city.id}</td>
                        <td className="border p-2">{city.name}</td>
                        <td className="border p-2">{city.country?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Categories ({data.categories.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTable('categories')}
              >
                {expandedTables.has('categories') ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {expandedTables.has('categories') && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Slug</th>
                      <th className="border p-2 text-left">Colleges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.categories.map((category) => (
                      <tr key={category.id}>
                        <td className="border p-2">{category.id}</td>
                        <td className="border p-2">{category.name}</td>
                        <td className="border p-2">{category.slug}</td>
                        <td className="border p-2">{category.colleges?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Exams Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Exams ({data.exams.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleTable('exams')}
              >
                {expandedTables.has('exams') ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {expandedTables.has('exams') && (
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Short Name</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-left">Colleges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.exams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="border p-2">{exam.id}</td>
                        <td className="border p-2">{exam.name}</td>
                        <td className="border p-2">{exam.shortName}</td>
                        <td className="border p-2">{exam.examType}</td>
                        <td className="border p-2">{exam.colleges?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
