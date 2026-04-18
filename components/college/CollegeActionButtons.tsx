'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

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
      
      // Add to compare list
      const updated = [...currentCompare, {
        id: college.id,
        name: college.name,
        slug: college.slug,
        logo: college.logoURL || '',
        city: college.city?.name || '',
        state: college.city?.state?.name || '',
        fees: 'N/A',
        rating: college.Countryranking || 0,
        placement: 'N/A',
        courses: college.courses?.map((c: any) => c.name) || [],
        category: college.categories?.[0]?.name || 'Unknown'
      }]
      localStorage.setItem('compareColleges', JSON.stringify(updated))
      setIsAdded(true)
    }

    // Trigger storage event to update other components
    window.dispatchEvent(new Event('storage'))
  }

  // Check if college is already in compare list on mount
  useState(() => {
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]')
    setIsAdded(currentCompare.some((c: College) => c.id === college.id))
  })

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
