'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface CollegeActionButtonsProps {
  collegeSlug: string
  college: any
}

export function CollegeActionButtons({ college }: CollegeActionButtonsProps) {
  const router = useRouter()
  const { openModal } = useAdmissionModal()
  const [isAdded, setIsAdded] = useState(false)

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]')
    const exists = currentCompare.some((c: { id: string }) => c.id === college.id)

    if (!exists) {
      if (currentCompare.length >= 4) {
        router.push('/compare-colleges')
        return
      }

      const updated = [
        ...currentCompare,
        {
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
        },
      ]
      localStorage.setItem('compareColleges', JSON.stringify(updated))
      setIsAdded(true)
      window.dispatchEvent(new Event('storage'))
    }

    router.push('/compare-colleges')
  }

  useEffect(() => {
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]')
    setIsAdded(currentCompare.some((c: { id: string }) => c.id === college.id))
  }, [college.id])

  return (
    <div className="flex flex-col gap-3 md:w-44">
      <Button
        onClick={handleCompare}
        variant={isAdded ? 'secondary' : 'outline'}
        className={`w-full py-5 text-[15px] border font-semibold hover:bg-gray-50 ${
          isAdded
            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
            : 'border-black'
        }`}
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
        onClick={() => openModal(college.name)}
        className="w-full bg-orange-500 hover:bg-orange-600 py-5 text-[15px] font-semibold"
      >
        Apply Now
      </Button>
      <Button
        onClick={() => openModal(college.name)}
        className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-[15px] font-semibold"
      >
        Brochure
      </Button>
    </div>
  )
}
