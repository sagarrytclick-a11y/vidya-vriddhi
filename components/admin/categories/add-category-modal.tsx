'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useRef } from 'react'
import NextImage from 'next/image'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
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

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  categoryImageUrl: string
  active: boolean
}

export function AddCategoryModal({ isOpen, onClose, onSubmit, isSubmitting = false }: AddCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    categoryImageUrl: '',
    active: false,
  })
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        name: '',
        slug: '',
        description: '',
        categoryImageUrl: '',
        active: false,
      })
      setUploadedImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error('Failed to create category')
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
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      setUploadedImage(data.url)
      setFormData(prev => ({ ...prev, categoryImageUrl: data.url }))
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
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
    setFormData(prev => ({ ...prev, categoryImageUrl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-2xl")}>
        <DialogHeader>
          <DialogTitle className="text-white">Add New Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className={adminLabelClass}>Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                className={adminFieldClass}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug" className={adminLabelClass}>Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className={adminFieldClass}
                placeholder="category-slug"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description" className={adminLabelClass}>Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={adminFieldClass}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="categoryImage" className={adminLabelClass}>Category Image</Label>
              <div className="space-y-3">
                <AdminImageDropzone
                  label="Upload image"
                  uploading={uploadingImage}
                  hint="PNG, JPG, GIF up to 5MB · drag & drop or browse"
                  onFiles={async (files) => {
                    if (files[0]) await handleImageUpload(files[0])
                  }}
                />
                
                {(uploadedImage || formData.categoryImageUrl) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0f14] border border-white/6">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-[#080a0e] border border-white/6 flex-shrink-0">
                        <NextImage
                          src={uploadedImage || formData.categoryImageUrl || ''}
                          alt="Category preview"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white break-all" title={uploadedImage || formData.categoryImageUrl}>
{uploadedImage || formData.categoryImageUrl || ''}
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
                  value={formData.categoryImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryImageUrl: e.target.value }))}
                  className={adminFieldClass}
                  placeholder="https://example.com/category-image.jpg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked as boolean }))}
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
            <Button type="submit" disabled={isSubmitting} className={adminPrimaryBtnClass}>
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
