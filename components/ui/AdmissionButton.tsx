'use client'

import { useAdmissionModal } from '@/contexts/admission-modal-context'
import { Button } from '@/components/ui/button'

interface AdmissionButtonProps {
  examName: string
  variant?: 'default' | 'white' | 'compact'
}

export function AdmissionButton({ examName, variant = 'default' }: AdmissionButtonProps) {
  const { openModal } = useAdmissionModal()

  const handleClick = () => {
    openModal(examName)
  }

  if (variant === 'white') {
    return (
      <Button 
        onClick={handleClick}
        className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl"
      >
        Apply for Admission
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleClick}
        size="sm"
        className="h-8 rounded-md bg-orange-600 px-3 text-xs font-semibold text-white hover:bg-orange-700"
      >
        Apply
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-slate-950 hover:bg-slate-900 text-white h-12 rounded-xl font-bold"
    >
      Quick Registration
    </Button>
  )
}
