'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useAdminNews } from '@/hooks/useAdminNews'
import { News } from '@/hooks/useAdminNews'

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
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete News
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <p className="text-red-300 text-sm">
              Are you sure you want to delete the news 
              <span className="font-semibold text-white mx-1">"{news.title}"</span>?
            </p>
            <p className="text-red-400 text-xs mt-2">
              This action cannot be undone. The news will be permanently removed from the system.
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-gray-300 text-sm">
              <strong>News:</strong> {news.title}
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Slug:</strong> {news.slug}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            {isDeleting ? 'Deleting...' : 'Delete News'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
