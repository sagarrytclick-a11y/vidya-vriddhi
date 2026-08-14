'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check } from 'lucide-react'
import { Button } from './button'

interface College {
  id: string
  name: string
  slug: string
  description?: string
  logoURL?: string
  establishment_year?: number
  Countryranking?: string
  Internationalranking?: string
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
  const router = useRouter()
  const [isAdded, setIsAdded] = useState(false)

  const handleCompare = () => {
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]') as College[]
    const exists = currentCompare.some((c) => c.id === college.id)

    if (!exists) {
      if (currentCompare.length >= 4) {
        router.push('/compare-colleges')
        return
      }
      const updated = [...currentCompare, college]
      localStorage.setItem('compareColleges', JSON.stringify(updated))
      setIsAdded(true)
      window.dispatchEvent(new Event('storage'))
    }

    router.push('/compare-colleges')
  }

  useEffect(() => {
    const currentCompare = JSON.parse(localStorage.getItem('compareColleges') || '[]') as College[]
    setIsAdded(currentCompare.some((c) => c.id === college.id))
  }, [college.id])

  return (
    <Button
      variant={isAdded ? 'secondary' : variant}
      size={size}
      onClick={handleCompare}
      className={isAdded ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300' : ''}
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
  )
}
