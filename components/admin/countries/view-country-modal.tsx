'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

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

export function ViewCountryModal({ isOpen, onClose, country }: ViewCountryModalProps) {
  if (!isOpen || !country) return null

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">View Country</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country Name
              </label>
              <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md">
                {country.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug
              </label>
              <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md">
                {country.slug}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Flag Emoji
            </label>
            <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md text-center">
              {country.flagEmoji || 'No flag emoji set'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md min-h-[100px]">
              {country.description || 'No description provided'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  country.active 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {country.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Created At
              </label>
              <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md">
                {new Date(country.createdAt).toLocaleDateString()} {new Date(country.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Updated
            </label>
            <div className="p-3 bg-slate-700 border border-slate-600 text-white rounded-md">
              {new Date(country.updatedAt).toLocaleDateString()} {new Date(country.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-gray-300 hover:bg-slate-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
