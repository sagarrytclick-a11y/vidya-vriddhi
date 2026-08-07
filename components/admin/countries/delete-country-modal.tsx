'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  AdminModalShell,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'
import { cn } from '@/lib/utils'

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

  if (!country) return null

  return (
    <AdminModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Country"
      maxWidth="md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className={cn(adminCancelBtnClass, 'disabled:opacity-50')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(adminDangerBtnClass, 'disabled:opacity-50')}
          >
            {isDeleting ? 'Deleting...' : 'Delete Country'}
          </Button>
        </>
      }
    >
      <div className="mb-2">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center mr-4">
            <Trash2 className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Are you sure?</h3>
            <p className="text-[#9ca3af]">
              This action cannot be undone. This will permanently delete the country{' '}
              <span className="font-medium text-white">&quot;{country.name}&quot;</span>.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-300">
          {error}
        </div>
      )}
    </AdminModalShell>
  )
}
