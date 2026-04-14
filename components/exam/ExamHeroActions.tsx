'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Download } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface ExamHeroActionsProps {
  examName: string
}

export function ExamHeroActions({ examName }: ExamHeroActionsProps) {
  const { openModal } = useAdmissionModal()

  return (
    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
      <Button onClick={() => openModal()} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-14 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-0.5 active:scale-95">
        Apply for Admission 2026
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
      <Button onClick={() => openModal()} variant="outline" className="w-full border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-white h-14 rounded-xl backdrop-blur-sm">
        <Download className="w-5 h-5 mr-2" />
        Syllabus PDF
      </Button>
    </div>
  )
}
