'use client'

import { useState, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'
import { Button } from './button'

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

interface CompareButtonProps {
  college: College
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export default function CompareButton({ college, variant = 'default', size = 'default' }: CompareButtonProps) {
  const [isAdded, setIsAdded] = useState(false)

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
        alert('You can compare up to 4 colleges at a time. Please remove one to add this college.')
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
  )
}
