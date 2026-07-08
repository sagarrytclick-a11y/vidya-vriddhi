'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Globe } from 'lucide-react'

interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  description: string | null
  active: boolean
}

interface EditCountryModalProps {
  isOpen: boolean
  onClose: () => void
  country: Country | null
  updateCountry: (data: any) => Promise<any>
  isUpdating: boolean
}

export function EditCountryModal({ isOpen, onClose, country, updateCountry, isUpdating }: EditCountryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    flagEmoji: '',
    description: '',
    active: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name,
        slug: country.slug,
        flagEmoji: country.flagEmoji || '',
        description: country.description || '',
        active: country.active
      })
    }
  }, [country])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!country) return

    setErrors({})

    try {
      await updateCountry({
        id: country.id,
        name: formData.name,
        slug: formData.slug,
        flagEmoji: formData.flagEmoji || undefined,
        description: formData.description || undefined,
        active: formData.active
      })

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 1500)
    } catch (error) {
      if (error instanceof Error) {
        // Parse error message for field errors
        const errorMessage = error.message
        if (errorMessage.includes('name')) {
          setErrors({ name: errorMessage })
        } else if (errorMessage.includes('slug')) {
          setErrors({ slug: errorMessage })
        } else {
          setErrors({ general: errorMessage })
        }
      } else {
        setErrors({ general: 'An unexpected error occurred' })
      }
    }
  }

  if (!isOpen || !country) return null

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Edit Country</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-300">
            Country updated successfully!
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-300">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter country name"
                className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-teal-500 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug *
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="Enter slug (e.g., united-states)"
                className={`bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-teal-500 ${
                  errors.slug ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-400">{errors.slug}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flag Emoji
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={formData.flagEmoji}
                onChange={(e) => handleChange('flagEmoji', e.target.value)}
                placeholder="🇺🇸"
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-teal-500 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter country description"
              rows={4}
              className="w-full bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-teal-500 rounded-md p-3"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="mr-2 h-4 w-4 bg-slate-700 border-slate-600 rounded focus:ring-teal-500"
              />
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUpdating}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
            >
              {isSubmitting || isUpdating ? 'Updating...' : 'Update Country'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
