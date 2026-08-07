'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useEffect, useRef } from 'react'
import NextImage from 'next/image'
import { useCityContext } from '@/contexts/city-context'
import { useCountryContext } from '@/contexts/country-context'
import { City } from '@/hooks/useAdminCities'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  adminCheckboxClass,
  adminDialogClass,
  adminFieldClass,
  adminSelectContentClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'
import { AdminImageDropzone } from '@/components/admin/image-dropzone'

interface EditCityModalProps {
  isOpen: boolean
  onClose: () => void
  city: City | null
}

export function EditCityModal({ isOpen, onClose, city }: EditCityModalProps) {
  const { updateCity, isUpdating } = useCityContext()
  const { countries } = useCountryContext()
  
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (city) {
      setFormData({
        description: city.description || '',
        cityImageURL: city.cityImageURL || '',
        features: city.features || [],
        active: city.active,
        countryId: city.countryId,
      })
      setUploadedImage(city.cityImageURL || null)
    }
  }, [city])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!city || !formData.countryId) {
      alert('Please select a country')
      return
    }

    try {
      const id = city.id
      const data = formData
      onClose()
      await updateCity({ id, data })
    } catch (error) {
      console.error('Failed to update city:', error)
      toast.error('Failed to update city')
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

  if (!city) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-2xl")}>
        <DialogHeader>
          <DialogTitle className="text-white">Edit City</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="country" className={adminLabelClass}>Country</Label>
              <Select value={formData.countryId} onValueChange={(value: string) => setFormData(prev => ({ ...prev, countryId: value }))}>
                <SelectTrigger className={adminFieldClass}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className={adminSelectContentClass}>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.flagEmoji} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description" className={adminLabelClass}>Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={adminFieldClass}
                placeholder="Enter city description"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="cityImage" className={adminLabelClass}>City Image</Label>
              <div className="space-y-3">
                <AdminImageDropzone
                  label="Upload image"
                  uploading={uploadingImage}
                  hint="PNG, JPG, GIF up to 5MB · drag & drop or browse"
                  onFiles={async (files) => {
                    if (files[0]) await handleImageUpload(files[0])
                  }}
                />
                
                {(uploadedImage || formData.cityImageURL) && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0c0f14] border border-white/6">
                      <div className="relative w-16 h-16 rounded overflow-hidden bg-[#080a0e] border border-white/6 flex-shrink-0">
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
                  value={formData.cityImageURL}
                  onChange={(e) => setFormData(prev => ({ ...prev, cityImageURL: e.target.value }))}
                  className={adminFieldClass}
                  placeholder="https://example.com/city-image.jpg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <Label className={adminLabelClass}>Features</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className={adminFieldClass}
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
                    className="bg-[#ea580c]/20 text-[#ea580c] border border-[#ea580c]/30 px-2 py-1 rounded-lg text-sm flex items-center gap-1"
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
            <Button type="submit" disabled={isUpdating} className={adminPrimaryBtnClass}>
              {isUpdating ? 'Updating...' : 'Update City'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
