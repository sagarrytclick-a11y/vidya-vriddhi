'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Globe } from 'lucide-react'
import {
  AdminModalShell,
  adminFieldClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'
import { cn } from '@/lib/utils'

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
      const payload = {
        id: country.id,
        name: formData.name,
        slug: formData.slug,
        flagEmoji: formData.flagEmoji || undefined,
        description: formData.description || undefined,
        active: formData.active
      }
      onClose()
      await updateCountry(payload)
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

  if (!country) return null

  return (
    <AdminModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Country"
      maxWidth="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className={adminCancelBtnClass}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-country-form"
            disabled={isSubmitting || isUpdating}
            className={cn(adminPrimaryBtnClass, 'disabled:opacity-50')}
          >
            {isSubmitting || isUpdating ? 'Updating...' : 'Update Country'}
          </Button>
        </>
      }
    >
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300">
          Country updated successfully!
        </div>
      )}

      {errors.general && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
          {errors.general}
        </div>
      )}

      <form id="edit-country-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Country Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter country name"
              className={cn(adminFieldClass, errors.name && 'border-rose-500 focus-visible:ring-rose-500/30')}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-rose-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Slug *
            </label>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="Enter slug (e.g., united-states)"
              className={cn(adminFieldClass, errors.slug && 'border-rose-500 focus-visible:ring-rose-500/30')}
              required
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-rose-400">{errors.slug}</p>
            )}
          </div>
        </div>

        <div>
          <label className={cn(adminLabelClass, 'block mb-2')}>
            Flag Emoji
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={formData.flagEmoji}
              onChange={(e) => handleChange('flagEmoji', e.target.value)}
              placeholder="🇺🇸"
              className={cn(adminFieldClass, 'text-center')}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={adminCancelBtnClass}
            >
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className={cn(adminLabelClass, 'block mb-2')}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter country description"
            rows={4}
            className={cn(adminFieldClass, 'w-full px-3 py-2')}
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center text-sm font-medium text-[#9ca3af]">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="mr-2 h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[5px] border-2 border-[#6b7280] bg-[#0c0f14] accent-[#ea580c]"
            />
            Active
          </label>
        </div>
      </form>
    </AdminModalShell>
  )
}
