'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCityContext } from '@/contexts/city-context'
import { City } from '@/hooks/useAdminCities'

interface DeleteCityModalProps {
  isOpen: boolean
  onClose: () => void
  city: City | null
}

export function DeleteCityModal({ isOpen, onClose, city }: DeleteCityModalProps) {
  const { deleteCity, isDeleting } = useCityContext()

  const handleDelete = async () => {
    if (!city) return

    try {
      await deleteCity(city.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete city:', error)
      alert('Failed to delete city')
    }
  }

  if (!city) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete City</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to delete the city <strong>{city.description || 'Unknown'}</strong>?
          </p>
          
          {city.country && (
            <p className="text-gray-400 text-sm">
              This city is associated with {city.country.name}. This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete City'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
