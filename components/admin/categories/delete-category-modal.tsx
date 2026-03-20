'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useCategories } from '@/hook/useCategories'

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: any
}

export function DeleteCategoryModal({ isOpen, onClose, category }: DeleteCategoryModalProps) {
  const { deleteCategory, isDeleting } = useCategories()

  const handleDelete = async () => {
    if (!category) return

    try {
      await deleteCategory(category.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete category:', error)
      // Error is already handled by the context with toast notification
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Category
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
          </p>
          
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">
              <strong>Category:</strong> {category.name}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Slug:</strong> {category.slug}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
