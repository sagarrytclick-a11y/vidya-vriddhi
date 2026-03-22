'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

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
    await onDelete(college.id)
  }

  if (!college) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete College
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-300 font-medium">Warning: This action cannot be undone!</p>
            <p className="text-gray-300 text-sm mt-2">
              Deleting this college will permanently remove all associated data including:
            </p>
            <ul className="text-gray-400 text-sm mt-2 list-disc list-inside space-y-1">
              <li>College information and details</li>
              <li>Associated categories and exams</li>
              <li>Course connections</li>
              <li>All related data</li>
            </ul>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-white font-medium">{college.name}</p>
            <p className="text-gray-400 text-sm">
              {college.city?.name}, {college.country?.name}
            </p>
            {college.description && (
              <p className="text-gray-400 text-sm mt-1 truncate">
                {college.description.substring(0, 100)}...
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
              {isDeleting ? 'Deleting...' : 'Delete College'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
