'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { useCityContext } from '@/contexts/city-context'
import { toast } from 'sonner'
import { useCountryContext } from '@/contexts/country-context'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { generateSlug } from '@/lib/utils'

interface AddCityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCityModal({ isOpen, onClose }: AddCityModalProps) {
  const { createCity, isCreating } = useCityContext()
  const { countries } = useCountryContext()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cityImageURL: '',
    features: [] as string[],
    active: false,
    countryId: '',
  })
  
  const [newFeature, setNewFeature] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a city name')
      return
    }
    
    if (!formData.slug.trim()) {
      alert('Please enter a city slug')
      return
    }
    
    if (!formData.countryId) {
      alert('Please select a country')
      return
    }

    try {
      await createCity(formData)
      onClose()
      setFormData({
        name: '',
        slug: '',
        description: '',
        cityImageURL: '',
        features: [],
        active: false,
        countryId: '',
      })
    } catch (error) {
      console.error('Failed to create city:', error)
      alert('Failed to create city')
    }
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
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      
      setUploadedImage(data.url)
      setFormData(prev => ({ ...prev, cityImageURL: data.url }))
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
    setFormData(prev => ({ ...prev, cityImageURL: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New City</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">City Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter city name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug">City Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="City slug will auto-generate from name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.countryId} onValueChange={(value) => setFormData(prev => ({ ...prev, countryId: value }))}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.flagEmoji} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter city description"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="cityImage">City Image</Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="cityImage"
                  />
                  <label
                    htmlFor="cityImage"
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
                
                {(uploadedImage || formData.cityImageURL) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <div className="relative w-16 h-16 bg-slate-600 rounded overflow-hidden flex-shrink-0">
                        <NextImage
                          src={uploadedImage || formData.cityImageURL || ''}
                          alt="City preview"
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
{uploadedImage || formData.cityImageURL || ''}
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
                  value={formData.cityImageURL}
                  onChange={(e) => setFormData(prev => ({ ...prev, cityImageURL: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="https://example.com/city-image.jpg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <Label>Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Add a feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-teal-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
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
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create City'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
