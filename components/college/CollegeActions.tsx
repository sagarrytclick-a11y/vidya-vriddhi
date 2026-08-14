'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Download, Plus, Check } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'
import { useEffect, useState } from 'react'

interface CollegeActionsProps {
  college: {
    id: string
    name: string
    slug: string
    description?: string | null
    logoURL?: string | null
    establishment_year?: number | null
    Countryranking?: string | null
    Internationalranking?: string | null
    features?: string[]
    keyHighlights?: unknown
    whyChooseUs?: unknown
    documentsRequired?: unknown
    feesStructure?: unknown
    admissionProcess?: unknown
    campusHighlights?: unknown
    city?: { name: string } | null
    country?: { name: string } | null
    categories?: { name: string }[]
    courses?: { name: string }[]
  }
}

function toComparePayload(college: CollegeActionsProps['college']) {
  return {
    id: college.id,
    name: college.name,
    slug: college.slug,
    description: college.description,
    logoURL: college.logoURL,
    establishment_year: college.establishment_year,
    Countryranking: college.Countryranking,
    Internationalranking: college.Internationalranking,
    features: college.features || [],
    keyHighlights: college.keyHighlights,
    whyChooseUs: college.whyChooseUs,
    documentsRequired: college.documentsRequired,
    feesStructure: college.feesStructure,
    admissionProcess: college.admissionProcess,
    campusHighlights: college.campusHighlights,
    city: college.city,
    country: college.country,
    categories: college.categories,
    courses: college.courses,
  }
}

export function CollegeActions({ college }: CollegeActionsProps) {
  const router = useRouter()
  const { openModal } = useAdmissionModal()
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem('compareColleges') || '[]')
      setIsAdded(current.some((c: { id: string }) => c.id === college.id))
    } catch {
      setIsAdded(false)
    }
  }, [college.id])

  const handleCompare = () => {
    try {
      const current = JSON.parse(localStorage.getItem('compareColleges') || '[]') as Array<{ id: string }>
      const exists = current.some((c) => c.id === college.id)

      if (!exists) {
        if (current.length >= 4) {
          // Go to compare page so user can remove one
          router.push('/compare-colleges')
          return
        }
        const updated = [...current, toComparePayload(college)]
        localStorage.setItem('compareColleges', JSON.stringify(updated))
        setIsAdded(true)
        window.dispatchEvent(new Event('storage'))
      }
    } catch {
      localStorage.setItem('compareColleges', JSON.stringify([toComparePayload(college)]))
      setIsAdded(true)
    }

    router.push('/compare-colleges')
  }

  return (
    <div className="flex flex-col gap-3 lg:w-64">
      <Button
        variant="outline"
        className={`w-full py-5 text-[15px] font-semibold border-black hover:bg-gray-50 ${
          isAdded ? 'border-green-400 bg-green-50 text-green-700 hover:bg-green-100' : ''
        }`}
        onClick={handleCompare}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Go to Compare
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Compare
          </>
        )}
      </Button>

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600 py-5 text-[15px] font-semibold"
        onClick={() => openModal(college.name)}
      >
        Apply Now
      </Button>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-[15px] font-semibold"
        onClick={() => openModal(college.name)}
      >
        <Download className="w-4 h-4 mr-2" />
        Brochure
      </Button>
    </div>
  )
}
