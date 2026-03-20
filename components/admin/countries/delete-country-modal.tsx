'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Trash2 } from 'lucide-react'
import { deleteCountry } from '@/actions/country'

interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

interface DeleteCountryModalProps {
  isOpen: boolean
  onClose: () => void
  country: Country | null
  deleteCountry: (id: string) => Promise<void>
  isDeleting: boolean
}

export function DeleteCountryModal({ isOpen, onClose, country, deleteCountry, isDeleting }: DeleteCountryModalProps) {
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!country) return

    try {
      await deleteCountry(country.id)
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  if (!isOpen || !country) return null

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Delete Country</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mr-4">
              <Trash2 className="h-6 w-6 text-red-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Are you sure?</h3>
              <p className="text-gray-300">
                This action cannot be undone. This will permanently delete the country{' '}
                <span className="font-medium text-white">"{country.name}"</span>.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Country'}
          </Button>
        </div>
      </div>
    </div>
  )
}
