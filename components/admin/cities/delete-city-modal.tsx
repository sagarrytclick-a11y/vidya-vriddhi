'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCityContext } from '@/contexts/city-context'
import { City } from '@/hooks/useAdminCities'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

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
      <DialogContent className={adminDialogClass}>
        <DialogHeader>
          <DialogTitle className="text-white">Delete City</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-white">
            Are you sure you want to delete the city <strong>{city.description || 'Unknown'}</strong>?
          </p>
          
          {city.country && (
            <p className="text-[#6b7280] text-sm">
              This city is associated with {city.country.name}. This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className={adminCancelBtnClass}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className={adminDangerBtnClass}
            >
              {isDeleting ? 'Deleting...' : 'Delete City'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
