'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

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
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Exam
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 font-medium">Warning: This action cannot be undone!</p>
            <p className="text-gray-300 text-sm mt-2">
              Deleting this exam will permanently remove:
            </p>
            <ul className="text-gray-400 text-sm mt-2 list-disc list-inside space-y-1">
              <li>Exam information and details</li>
              <li>Associated colleges</li>
              <li>Exam pattern and dates</li>
              <li>All related data</li>
            </ul>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-white font-medium">{exam.name}</p>
            <p className="text-gray-400 text-sm">
              {exam.shortName} • {exam.examType}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Conducted by: {exam.conductingBody}
            </p>
            {exam.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {exam.description.substring(0, 150)}...
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isDeleting}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Exam'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
