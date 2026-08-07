'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  adminViewDialogClass,
  adminViewHeaderClass,
  adminViewBodyClass,
} from '@/components/admin/modal-ui'

interface ViewCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: any
}

export function ViewCategoryModal({ isOpen, onClose, category }: ViewCategoryModalProps) {
  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminViewDialogClass, "max-w-2xl")}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white">Category Details</DialogTitle>
        </DialogHeader>

        <div className={cn(adminViewBodyClass, "space-y-6")}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Category Name</h3>
              <p className="text-white">{category.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Slug</h3>
              <p className="text-white">{category.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Status</h3>
              <Badge className={category.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-[#9ca3af] border border-white/10'}>
                {category.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {category.description && (
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Description</h3>
              <p className="text-white">{category.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Created</h3>
              <p className="text-white">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[#6b7280] mb-1">Last Updated</h3>
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
