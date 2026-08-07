'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useBlogContext } from '@/contexts/blog-context'
import { Blog } from '@/contexts/blog-context'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

interface DeleteBlogModalProps {
  isOpen: boolean
  onClose: () => void
  blog: Blog | null
}

export function DeleteBlogModal({ isOpen, onClose, blog }: DeleteBlogModalProps) {
  const { deleteBlog, isDeleting } = useBlogContext()

  const handleDelete = async () => {
    if (!blog) return

    try {
      await deleteBlog(blog.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete blog:', error)
      // Error is already handled by the context with toast notification
    }
  }

  if (!blog) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Blog
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-red-300 text-sm">
              Are you sure you want to delete the blog 
              <span className="font-semibold text-white mx-1">"{blog.title}"</span>?
            </p>
            <p className="text-rose-400 text-xs mt-2">
              This action cannot be undone. The blog will be permanently removed from the system.
            </p>
          </div>

          <div className="rounded-xl bg-[#0c0f14]/80 border border-white/6 p-3">
            <p className="text-[#9ca3af] text-sm">
              <strong>Blog:</strong> {blog.title}
            </p>
            <p className="text-[#9ca3af] text-sm">
              <strong>Slug:</strong> {blog.slug}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            {isDeleting ? 'Deleting...' : 'Delete Blog'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
