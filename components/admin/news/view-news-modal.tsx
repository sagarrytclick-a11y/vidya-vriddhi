'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { News } from '@/hooks/useAdminNews'
import NextImage from 'next/image'
import { Calendar, Eye, ImageIcon } from 'lucide-react'

interface ViewNewsModalProps {
  isOpen: boolean
  onClose: () => void
  news: News | null
}

export function ViewNewsModal({ isOpen, onClose, news }: ViewNewsModalProps) {
  if (!news) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            News Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{news.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(news.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant={news.active ? "default" : "secondary"}>
                    {news.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {news.imageUrl && (
              <div className="relative w-full h-64 bg-slate-700 rounded-lg overflow-hidden">
                <NextImage
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1024px"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-slate-500" />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{news.content}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <label className="text-sm font-medium text-gray-400">Slug</label>
              <p className="text-white mt-1">{news.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Status</label>
              <div className="text-white mt-1">
                <Badge variant={news.active ? "default" : "secondary"}>
                  {news.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Created</label>
              <p className="text-white mt-1">
                {new Date(news.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Last Updated</label>
              <p className="text-white mt-1">
                {new Date(news.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {news.imageUrl && (
            <div className="pt-4 border-t border-slate-700">
              <label className="text-sm font-medium text-gray-400">Image URL</label>
              <p className="text-white mt-1 text-sm break-all">{news.imageUrl}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
