"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FileText, ChevronRight, Search, X, Filter, ChevronDown, ArrowRight 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface Exam {
  id: string
  name: string
  slug: string
  shortName: string
  description: string
  conductingBody: string
  examMode: string
  examType: string
  frequency: string
  examImageurl: string | null
  examDates: any
  examPattern: any
  overview?: any
  registration?: any
  resultStatistics: any
  createdAt: Date
}

interface ExamsListClientProps {
  exams: Exam[]
}

export default function ExamsListClient({ exams }: ExamsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedModes, setSelectedModes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('recommended')

  // Filter exams client-side (instant, no page reload)
  const filteredExams = useMemo(() => {
    let result = [...exams]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(e => 
        e.name.toLowerCase().includes(query) ||
        e.shortName.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(e => selectedTypes.includes(e.examType))
    }

    // Mode filter
    if (selectedModes.length > 0) {
      result = result.filter(e => selectedModes.includes(e.examMode))
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'popular':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [exams, searchQuery, selectedTypes, selectedModes, sortBy])

  // Filter counts (based on original data)
  const typeCounts = useMemo(() => ({
    NATIONAL: exams.filter(e => e.examType === 'NATIONAL').length,
    STATE: exams.filter(e => e.examType === 'STATE').length,
    UNIVERSITY: exams.filter(e => e.examType === 'UNIVERSITY').length,
    INTERNATIONAL: exams.filter(e => e.examType === 'INTERNATIONAL').length,
  }), [exams])

  const modeCounts = useMemo(() => ({
    ONLINE: exams.filter(e => e.examMode === 'ONLINE').length,
    OFFLINE: exams.filter(e => e.examMode === 'OFFLINE').length,
    HYBRID: exams.filter(e => e.examMode === 'HYBRID').length,
  }), [exams])

  // Active filters for display
  const activeFilters = [
    ...selectedTypes.map(t => ({ type: 'type', value: t })),
    ...selectedModes.map(m => ({ type: 'mode', value: m })),
    ...(searchQuery ? [{ type: 'search', value: searchQuery }] : [])
  ]

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleMode = (mode: string) => {
    setSelectedModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    )
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedTypes([])
    setSelectedModes([])
    setSortBy('recommended')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar Filters */}
      <aside className="lg:w-72 shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Filter By</span>
            </div>
            <button 
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          </div>

          {/* Search Filter */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Exam Type Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Category of Exams
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </h3>
            <div className="space-y-2">
              {[
                { label: 'National', value: 'NATIONAL', count: typeCounts.NATIONAL },
                { label: 'State', value: 'STATE', count: typeCounts.STATE },
                { label: 'University', value: 'UNIVERSITY', count: typeCounts.UNIVERSITY },
                { label: 'International', value: 'INTERNATIONAL', count: typeCounts.INTERNATIONAL },
              ].map((item) => (
                <div 
                  key={item.value} 
                  className="flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`type-${item.value}`}
                      checked={selectedTypes.includes(item.value)}
                      onCheckedChange={() => toggleType(item.value)}
                      className="border-gray-300"
                    />
                    <label 
                      htmlFor={`type-${item.value}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">({item.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Mode Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Exam Mode
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Online', value: 'ONLINE', count: modeCounts.ONLINE },
                { label: 'Offline', value: 'OFFLINE', count: modeCounts.OFFLINE },
                { label: 'Hybrid', value: 'HYBRID', count: modeCounts.HYBRID },
              ].map((item) => (
                <div 
                  key={item.value}
                  className="flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={`mode-${item.value}`}
                      checked={selectedModes.includes(item.value)}
                      onCheckedChange={() => toggleMode(item.value)}
                      className="border-gray-300"
                    />
                    <label 
                      htmlFor={`mode-${item.value}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {item.label}
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">({item.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Exam List */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Results Count */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Showing</span>
              <span className="text-blue-600 font-semibold">{filteredExams.length}</span>
              <span className="text-gray-600">of {exams.length} Exams</span>
            </div>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((filter, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-blue-50 text-blue-600 flex items-center gap-1 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      if (filter.type === 'type') toggleType(filter.value)
                      else if (filter.type === 'mode') toggleMode(filter.value)
                      else setSearchQuery('')
                    }}
                  >
                    {filter.value}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}

function ExamCard({ exam }: { exam: Exam }) {
  const { openModal } = useAdmissionModal()
  const examDates = exam.examDates as any
  const importantDates = examDates?.importantDates || []
  const resultDate = importantDates.find((d: any) => d.event?.toLowerCase().includes('result'))?.date
  const examDate = importantDates.find((d: any) => d.event?.toLowerCase().includes('exam'))?.date
  const regDate = importantDates.find((d: any) => d.event?.toLowerCase().includes('registration') || d.event?.toLowerCase().includes('application'))?.date

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo */}
          <div className="w-16 h-16 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            {exam.examImageurl ? (
              <Image
                src={exam.examImageurl}
                alt={exam.shortName}
                width={64}
                height={64}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <FileText className="w-8 h-8 text-orange-500" />
            )}
          </div>

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <Link 
              href={`/exams/${exam.slug}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {exam.name}
            </Link>
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium">
                {exam.examMode === 'ONLINE' ? 'Online' : exam.examMode === 'OFFLINE' ? 'Offline' : 'Hybrid'}
              </Badge>
              <Badge variant="outline" className="text-gray-600 text-xs">
                UG
              </Badge>
              <span className="text-sm text-gray-500">{exam.conductingBody}</span>
              <Badge variant="outline" className="text-gray-600 text-xs">
                {exam.frequency?.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-col gap-2">
            <Button onClick={() => openModal(exam.name)} className="bg-slate-800 py-4 text-white text-[16px] px-6">
              Apply Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="text-white py-4 bg-orange-500 hover:bg-orange-600 text-[16px] px-6">
              <Link href={`/exams/${exam.slug}`} className="flex items-center">
                View Details <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Important Dates Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Results</p>
            <p className="text-sm text-gray-700">{resultDate || 'TBA'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Exam Date</p>
            <p className="text-sm text-red-500 font-medium">{examDate || 'TBA'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Registration</p>
            <p className="text-sm text-gray-700">{regDate || 'TBA'}</p>
          </div>
        </div>

        {/* Exam Info Sections */}
        <div className="space-y-3">
          {/* Overview */}
          {exam.overview?.content && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {exam.overview.content}
            </p>
          )}
          
          {/* Exam Pattern */}
          {exam.examPattern?.tableData?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-500">Subjects:</span>
              {exam.examPattern.tableData.map((section: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {section.section} ({section.questions} Q)
                </Badge>
              ))}
            </div>
          )}
          
          {/* Score & Duration */}
          <div className="flex flex-wrap gap-4 text-sm">
            {exam.examPattern?.scoreRange && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Total Marks:</span>
                <span className="font-medium text-gray-700">{exam.examPattern.scoreRange}</span>
              </div>
            )}
            {exam.examPattern?.totalDurationMins > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium text-gray-700">{exam.examPattern.totalDurationMins} mins</span>
              </div>
            )}
            {exam.resultStatistics?.totalMarks > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-gray-500">Max Score:</span>
                <span className="font-medium text-gray-700">{exam.resultStatistics.totalMarks}</span>
              </div>
            )}
          </div>
          
          {/* Key Highlights */}
          {exam.overview?.keyHighlights?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exam.overview.keyHighlights.slice(0, 3).map((highlight: string, idx: number) => (
                <span key={idx} className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                  {highlight}
                </span>
              ))}
            </div>
          )}
          
          {/* Registration Note */}
          {exam.registration?.description && (
            <p className="text-xs text-gray-500">
              <span className="font-medium">Registration:</span> {exam.registration.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
