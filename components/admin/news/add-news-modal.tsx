'use client'

import NextImage from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useRef } from 'react'
import { useAdminNews, NewsFormData } from '@/hooks/useAdminNews'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn, generateSlug } from '@/lib/utils'
import { toast } from 'sonner'
import {
  adminCheckboxClass,
  adminDialogClass,
  adminFieldClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'
import { AdminImageDropzone } from '@/components/admin/image-dropzone'

export type { NewsFormData }

interface AddNewsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: NewsFormData) => Promise<void>
}

export function AddNewsModal({ isOpen, onClose, onSubmit }: AddNewsModalProps) {
  const { createNews, isCreating } = useAdminNews()
  
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    slug: '',
    content: '',
    imageUrl: '',
    active: false,
  })
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a news title')
      return
    }
    
    if (!formData.slug.trim()) {
      toast.error('Please enter a news slug')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('Please enter news content')
      return
    }

    try {
      const payload = { ...formData }
      setFormData({
        title: '',
        slug: '',
        content: '',
        imageUrl: '',
        active: false,
      })
      setUploadedImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose()
      if (onSubmit) {
        await onSubmit(payload)
      } else {
        await createNews(payload)
      }
    } catch (error) {
      console.error('Failed to create news:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB')
      return
    }
    
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const data = await response.json()
      
      setUploadedImage(data.url)
      setFormData(prev => ({ ...prev, imageUrl: data.url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
    }
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }
  
  const removeUploadedImage = () => {
    setUploadedImage(null)
    setFormData(prev => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-3xl")}>
        <DialogHeader>
          <DialogTitle className="text-white">Add New News</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title" className={adminLabelClass}>News Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className={adminFieldClass}
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug" className={adminLabelClass}>News Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className={adminFieldClass}
                placeholder="News slug will auto-generate from title"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="content" className={adminLabelClass}>Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className={cn(adminFieldClass, "min-h-[150px]")}
                placeholder="Enter news content"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="newsImage" className={adminLabelClass}>News Image</Label>
              <div className="space-y-3">
                <AdminImageDropzone
                  label="Upload image"
                  uploading={uploadingImage}
                  hint="PNG, JPG, GIF up to 5MB · drag & drop or browse"
                  onFiles={async (files) => {
                    if (files[0]) await handleImageUpload(files[0])
                  }}
                />
                
                {(uploadedImage || formData.imageUrl) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0f14] border border-white/6">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-[#080a0e] border border-white/6 shrink-0">
                        <NextImage
                          src={uploadedImage || formData.imageUrl || ''}
                          alt="News preview"
                          fill
                          className="object-cover"
                          sizes="64px"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">
{uploadedImage || formData.imageUrl || ''}
                        </p>
                        <p className="text-xs text-slate-400">Image uploaded to ImageKit</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeUploadedImage}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>
                
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className={adminFieldClass}
                  placeholder="https://example.com/news-image.jpg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
                  className={adminCheckboxClass}
                />
                <Label htmlFor="active" className={adminLabelClass}>Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className={adminCancelBtnClass}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className={adminPrimaryBtnClass}>
              {isCreating ? 'Creating...' : 'Create News'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
