'use client'

import { Button } from '@/components/ui/button'
import {
  AdminModalShell,
  adminCancelBtnClass,
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
  createdAt: string
  updatedAt: string
}

interface ViewCountryModalProps {
  isOpen: boolean
  onClose: () => void
  country: Country | null
}

const readOnlyFieldClass = 'rounded-xl bg-[#0c0f14] border border-white/6 p-3 text-white'

export function ViewCountryModal({ isOpen, onClose, country }: ViewCountryModalProps) {
  if (!country) return null

  return (
    <AdminModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="View Country"
      maxWidth="lg"
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className={adminCancelBtnClass}
        >
          Close
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Country Name
            </label>
            <div className={readOnlyFieldClass}>
              {country.name}
            </div>
          </div>

          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Slug
            </label>
            <div className={readOnlyFieldClass}>
              {country.slug}
            </div>
          </div>
        </div>

        <div>
          <label className={cn(adminLabelClass, 'block mb-2')}>
            Flag Emoji
          </label>
          <div className={cn(readOnlyFieldClass, 'text-center')}>
            {country.flagEmoji || 'No flag emoji set'}
          </div>
        </div>

        <div>
          <label className={cn(adminLabelClass, 'block mb-2')}>
            Description
          </label>
          <div className={cn(readOnlyFieldClass, 'min-h-[100px]')}>
            {country.description || 'No description provided'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Status
            </label>
            <div className={readOnlyFieldClass}>
              <span className={`px-2 py-1 text-xs rounded-full ${
                country.active 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-white/5 text-[#9ca3af] border border-white/10'
              }`}>
                {country.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div>
            <label className={cn(adminLabelClass, 'block mb-2')}>
              Created At
            </label>
            <div className={readOnlyFieldClass}>
              {new Date(country.createdAt).toLocaleDateString()} {new Date(country.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div>
          <label className={cn(adminLabelClass, 'block mb-2')}>
            Last Updated
          </label>
          <div className={readOnlyFieldClass}>
            {new Date(country.updatedAt).toLocaleDateString()} {new Date(country.updatedAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </AdminModalShell>
  )
}
