'use client'

import { useState, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from './button'
import { CompareLimitModal } from './success-modal'

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

interface CompareButtonProps {
  college: College
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export default function CompareButton({ college, variant = 'default', size = 'default' }: CompareButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const handleCompare = () => {
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
        setShowLimitModal(true)
        return
      }
      
      // Add to compare list
      const updated = [...currentCompare, college]
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
    <>
      <Button
        variant={isAdded ? 'secondary' : variant}
        size={size}
        onClick={handleCompare}
        className={isAdded ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' : ''}
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
      
      {/* Compare Limit Modal */}
      <CompareLimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />
    </>
  )
}
