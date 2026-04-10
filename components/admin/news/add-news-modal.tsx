'use client'

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
import { generateSlug } from '@/lib/utils'
import { toast } from 'sonner'

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
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        await createNews(formData)
      }
      toast.success(`News "${formData.title}" created successfully`)
      onClose()
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
    } catch (error) {
      console.error('Failed to create news:', error)
      // Toast error is already handled by the hook
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
      
      console.log('Uploading file:', file.name, file.type, file.size)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      console.log('Upload response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const data = await response.json()
      console.log('Upload success:', data)
      
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
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New News</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">News Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter news title"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug">News Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="News slug will auto-generate from title"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-slate-700 border-slate-600 min-h-[150px]"
                placeholder="Enter news content"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="newsImage">News Image</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="newsImage"
                  />
                  <label
                    htmlFor="newsImage"
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    {uploadingImage ? (
                      <LoadingButton text="Uploading to ImageKit..." size="md" />
                    ) : (
                      <span className="text-sm text-slate-300">Click to upload image</span>
                    )}
                    <span className="text-xs text-slate-500 mt-1">
                      PNG, JPG, GIF up to 5MB • Powered by ImageKit
                    </span>
                  </label>
                </div>
                
                {(uploadedImage || formData.imageUrl) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <div className="relative w-16 h-16 bg-slate-600 rounded overflow-hidden shrink-0">
                        <img
                          src={uploadedImage || formData.imageUrl}
                          alt="News preview"
                          className="w-full h-full object-cover"
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
                          {uploadedImage || formData.imageUrl}
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
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
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
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create News'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
