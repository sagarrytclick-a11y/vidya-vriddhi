'use client'


import { Button } from '@/components/ui/button'
import { Download, CheckCircle2, Plus } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface CollegeActionsProps {
  collegeName: string
}

export function CollegeActions({ collegeName }: CollegeActionsProps) {
  const { openModal } = useAdmissionModal()




  const handleApply = () => {
    openModal()
  }

  return (
    <div className="flex flex-col gap-3 lg:w-64">
      <Button
        variant="outline"
        className="w-full py-5 text-[15px] font-semibold border-black hover:bg-gray-50"
      onClick={handleApply}
      >
        <Plus className="w-4 h-4 mr-2" />
        Compare
      </Button>

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600 py-5 text-[15px] font-semibold"
        onClick={handleApply}
      >
        Apply Now
      </Button>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-[15px] font-semibold"
       onClick={handleApply}
      >
        <Download className="w-4 h-4 mr-2" />
        Brochure
      </Button>
    </div>
  )
}
