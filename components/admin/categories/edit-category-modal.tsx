'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { useCategoryContext } from '@/contexts/category-context'
import { cn, generateSlug } from '@/lib/utils'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import {
  adminCheckboxClass,
  adminDialogClass,
  adminFieldClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'
import { AdminImageDropzone } from '@/components/admin/image-dropzone'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: any
  onUpdate: (data: any) => Promise<void>
  isUpdating?: boolean
}

export function EditCategoryModal({ isOpen, onClose, category, onUpdate, isUpdating = false }: EditCategoryModalProps) {
  const { updateCategory } = useCategoryContext()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    active: false,
    categoryImageUrl: ''
  })
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        active: category.active ?? false,
        categoryImageUrl: category.categoryImageUrl || ''
      })
      setUploadedImage(category.categoryImageUrl || null)
    }
  }, [category])

  const handleNameChange = (value: string) => {
    const slug = generateSlug(value)
    setFormData(prev => ({ 
      ...prev, 
      name: value, 
      slug: slug 
    }))
  }

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }))
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB')
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
      alert('Failed to upload image')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category) {
      alert('No category selected')
      return
    }

    if (!formData.name) {
      alert('Please enter a category name')
      return
    }

    try {
      await onUpdate(formData)
      onClose()
    } catch (error) {
      console.error('Failed to update category:', error)
      alert('Failed to update category')
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-2xl max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <DialogTitle className="text-white">Edit Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className={adminLabelClass}>Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={adminFieldClass}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug" className={adminLabelClass}>Category Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={adminFieldClass}
                placeholder="Category slug will auto-generate from name"
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
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-[#080a0e] border border-white/6 shrink-0">
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
                        <div className="hidden w-full h-full items-center justify-center">
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
            <Button type="submit" disabled={isUpdating} className={adminPrimaryBtnClass}>
              {isUpdating ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
