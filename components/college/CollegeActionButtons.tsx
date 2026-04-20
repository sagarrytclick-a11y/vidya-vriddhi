'use client'

import { useState, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

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

interface CollegeActionButtonsProps {
  collegeSlug: string
  college: any
}

export function CollegeActionButtons({ collegeSlug, college }: CollegeActionButtonsProps) {
  const { openModal } = useAdmissionModal()
  const [isAdded, setIsAdded] = useState(false)

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to college slug page
    e.stopPropagation()
    
    // Get current compare list from localStorage
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]')
    
    // Check if college is already added
    const exists = currentCompare.some((c: College) => c.id === college.id)
    
    if (exists) {
      // Remove from compare list
      const updated = currentCompare.filter((c: College) => c.id !== college.id)
      localStorage.setItem('compareColleges', JSON.stringify(updated))
      setIsAdded(false)
    } else {
      // Check max limit (4 colleges)
      if (currentCompare.length >= 4) {
        alert('You can compare up to 4 colleges at a time. Please remove one to add this college.')
        return
      }
      
      // Add to compare list with full college data
      const updated = [...currentCompare, {
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
        courses: college.courses
      }]
      localStorage.setItem('compareColleges', JSON.stringify(updated))
      setIsAdded(true)
    }

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'))
  }

  // Check if college is already in compare list on mount
  useEffect(() => {
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]')
    setIsAdded(currentCompare.some((c: College) => c.id === college.id))
  }, [college.id])

  return (
    <div className="flex flex-col gap-3 md:w-44">
      <Button 
        onClick={handleCompare}
        variant={isAdded ? 'secondary' : 'outline'}
        className={`w-full py-5 text-[15px] border font-semibold hover:bg-gray-50 ${
          isAdded ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'border-black'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added to Compare
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Compare
          </>
        )}
      </Button>
      <Button 
        onClick={() => openModal()} 
        className="w-full bg-orange-500 hover:bg-orange-600 py-5 text-[15px] font-semibold"
      >
        Apply Now
      </Button>
      <Button 
        onClick={() => openModal()} 
        className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-[15px] font-semibold"
      >
        Brochure
      </Button>
    </div>
  )
}
