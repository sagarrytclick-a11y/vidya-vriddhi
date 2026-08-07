'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

interface DeleteCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  college: any
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function DeleteCollegeModal({ isOpen, onClose, college, onDelete, isDeleting = false }: DeleteCollegeModalProps) {
  const handleDelete = async () => {
    if (!college) return
    
    try {
      await onDelete(college.id)
      toast.success(`College "${college.name}" deleted successfully`)
      onClose()
    } catch (error) {
      console.error('Failed to delete college:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete college')
    }
  }

  if (!college) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete College
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-rose-300 font-medium">Warning: This action cannot be undone!</p>
            <p className="text-[#9ca3af] text-sm mt-2">
              Deleting this college will permanently remove all associated data including:
            </p>
            <ul className="text-[#6b7280] text-sm mt-2 list-disc list-inside space-y-1">
              <li>College information and details</li>
              <li>Associated categories and exams</li>
              <li>Course connections</li>
              <li>All related data</li>
            </ul>
          </div>
          
          <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-3">
            <p className="text-white font-medium">{college.name}</p>
            <p className="text-[#6b7280] text-sm">
              {college.city?.name}, {college.country?.name}
            </p>
            {college.description && (
              <p className="text-[#6b7280] text-sm mt-1 truncate">
                {college.description.substring(0, 100)}...
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
              {isDeleting ? 'Deleting...' : 'Delete College'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
