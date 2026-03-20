'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface ViewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: any
}

export function ViewCategoryModal({ isOpen, onClose, category }: ViewCategoryModalProps) {
  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Category Name</h3>
              <p className="text-white">{category.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Slug</h3>
              <p className="text-white">{category.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
              <Badge className={category.active ? 'bg-green-600' : 'bg-gray-600'}>
                {category.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {category.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
              <p className="text-white">{category.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
              <p className="text-white">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
              <p className="text-white">
                {new Date(category.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
