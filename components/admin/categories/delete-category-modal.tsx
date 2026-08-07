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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  categoryImageUrl: string | null
  createdAt: string
  updatedAt: string
}

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
  onDelete: () => void
  isDeleting?: boolean
}

export function DeleteCategoryModal({ isOpen, onClose, category, onDelete, isDeleting = false }: DeleteCategoryModalProps) {
  const handleDelete = async () => {
    if (!category) return
    onDelete()
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Category
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
          </p>
          
          <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-3">
            <p className="text-sm text-[#6b7280]">
              <strong>Category:</strong> {category.name}
            </p>
            <p className="text-sm text-[#6b7280]">
              <strong>Slug:</strong> {category.slug}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className={adminCancelBtnClass}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleDelete}
              disabled={isDeleting}
              className={adminDangerBtnClass}
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
