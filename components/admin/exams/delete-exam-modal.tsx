'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

interface DeleteExamModalProps {
  isOpen: boolean
  onClose: () => void
  exam: any
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DeleteExamModal({ isOpen, onClose, exam, onDelete, isDeleting = false }: DeleteExamModalProps) {
  const handleDelete = async () => {
    if (!exam) return
    await onDelete(exam.id)
  }

  if (!exam) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Exam
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-rose-300 font-medium">Warning: This action cannot be undone!</p>
            <p className="text-[#9ca3af] text-sm mt-2">
              Deleting this exam will permanently remove:
            </p>
            <ul className="text-[#6b7280] text-sm mt-2 list-disc list-inside space-y-1">
              <li>Exam information and details</li>
              <li>Associated colleges</li>
              <li>Exam pattern and dates</li>
              <li>All related data</li>
            </ul>
          </div>
          
          <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-3">
            <p className="text-white font-medium">{exam.name}</p>
            <p className="text-[#6b7280] text-sm">
              {exam.shortName} • {exam.examType}
            </p>
            <p className="text-[#6b7280] text-sm mt-1">
              Conducted by: {exam.conductingBody}
            </p>
            {exam.description && (
              <p className="text-[#6b7280] text-sm mt-2 line-clamp-2">
                {exam.description.substring(0, 150)}...
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isDeleting}
              className={adminCancelBtnClass}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className={adminDangerBtnClass}
            >
              {isDeleting ? 'Deleting...' : 'Delete Exam'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
