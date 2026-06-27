'use client'

import NextImage from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { City } from '@/hooks/useAdminCities'

interface ViewCityModalProps {
  isOpen: boolean
  onClose: () => void
  city: City | null
}

export function ViewCityModal({ isOpen, onClose, city }: ViewCityModalProps) {
  if (!city) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>City Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Country</h3>
              <p className="text-white">
                {city.country?.flagEmoji} {city.country?.name || 'N/A'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
              <Badge className={city.active ? 'bg-green-600' : 'bg-gray-600'}>
                {city.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {city.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
              <p className="text-white">{city.description}</p>
            </div>
          )}

          {city.cityImageURL && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">City Image</h3>
              <NextImage
                src={city.cityImageURL}
                alt="City"
                width={400}
                height={192}
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
                unoptimized
              />
            </div>
          )}

          {city.features.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {city.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-600">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Created</h3>
              <p className="text-white">
                {new Date(city.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h3>
              <p className="text-white">
                {new Date(city.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
