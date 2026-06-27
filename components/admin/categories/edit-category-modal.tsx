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
import { generateSlug } from '@/lib/utils'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

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
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug">Category Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Category slug will auto-generate from name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="categoryImage">Category Image</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="categoryImage"
                  />
                  <label
                    htmlFor="categoryImage"
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    {uploadingImage ? (
                      <LoadingButton text="Uploading to ImageKit..." size="md" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-300">Click to upload image</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500 mt-1">
                      PNG, JPG, GIF up to 5MB • Powered by ImageKit
                    </span>
                  </label>
                </div>
                
                {(uploadedImage || formData.categoryImageUrl) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <div className="relative w-16 h-16 bg-slate-600 rounded overflow-hidden shrink-0">
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
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                </div>
                
                <Input
                  type="url"
                  value={formData.categoryImageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryImageUrl: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
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
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
