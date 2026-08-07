'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Blog } from '@/contexts/blog-context'
import NextImage from 'next/image'
import { Calendar, Eye, ImageIcon } from 'lucide-react'
import {
  adminViewDialogClass,
  adminViewHeaderClass,
  adminViewBodyClass,
} from '@/components/admin/modal-ui'

interface ViewBlogModalProps {
  isOpen: boolean
  onClose: () => void
  blog: Blog | null
}

export function ViewBlogModal({ isOpen, onClose, blog }: ViewBlogModalProps) {
  if (!blog) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminViewDialogClass, "max-w-4xl")}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Blog Details
          </DialogTitle>
        </DialogHeader>

        <div className={cn(adminViewBodyClass, "space-y-6")}>
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>
                <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant={blog.active ? "default" : "secondary"}>
                    {blog.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {blog.imageUrl && (
              <div className="relative w-full h-64 rounded-xl bg-[#0c0f14] border border-white/6 overflow-hidden">
                <NextImage
                  src={blog.imageUrl}
                  alt={blog.title}
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
              <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-4">
                <p className="text-[#9ca3af] whitespace-pre-wrap">{blog.content}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/6">
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Slug</label>
              <p className="text-white mt-1">{blog.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Status</label>
              <div className="mt-1">
                <Badge variant={blog.active ? "default" : "secondary"}>
                  {blog.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Created</label>
              <p className="text-white mt-1">
                {new Date(blog.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Last Updated</label>
              <p className="text-white mt-1">
                {new Date(blog.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {blog.imageUrl && (
            <div className="pt-4 border-t border-white/6">
              <label className="text-sm font-medium text-[#6b7280]">Image URL</label>
              <p className="text-white mt-1 text-sm break-all">{blog.imageUrl}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
