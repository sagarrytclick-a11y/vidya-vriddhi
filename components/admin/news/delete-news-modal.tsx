'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useAdminNews } from '@/hooks/useAdminNews'
import { News } from '@/hooks/useAdminNews'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

interface DeleteNewsModalProps {
  isOpen: boolean
  onClose: () => void
  news: News | null
}

export function DeleteNewsModal({ isOpen, onClose, news }: DeleteNewsModalProps) {
  const { deleteNews, isDeleting } = useAdminNews()

  const handleDelete = async () => {
    if (!news) return

    try {
      await deleteNews(news.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete news:', error)
      // Error is already handled by the hook with toast notification
    }
  }

  if (!news) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete News
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-red-300 text-sm">
              Are you sure you want to delete the news 
              <span className="font-semibold text-white mx-1">"{news.title}"</span>?
            </p>
            <p className="text-rose-400 text-xs mt-2">
              This action cannot be undone. The news will be permanently removed from the system.
            </p>
          </div>

          <div className="rounded-xl bg-[#0c0f14]/80 border border-white/6 p-3">
            <p className="text-[#9ca3af] text-sm">
              <strong>News:</strong> {news.title}
            </p>
            <p className="text-[#9ca3af] text-sm">
              <strong>Slug:</strong> {news.slug}
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
            {isDeleting ? 'Deleting...' : 'Delete News'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
