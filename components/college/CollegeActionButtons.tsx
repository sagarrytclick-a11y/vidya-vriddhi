'use client'

import { Button } from '@/components/ui/button'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface CollegeActionButtonsProps {
  collegeSlug: string
}

export function CollegeActionButtons({ collegeSlug }: CollegeActionButtonsProps) {
  const { openModal } = useAdmissionModal()

  return (
    <div className="flex flex-col gap-3 md:w-44">
      <Button 
        onClick={() => openModal()} 
        variant="outline" 
        className="w-full py-5 text-[15px] border border-black font-semibold hover:bg-gray-50"
      >
        Compare
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
