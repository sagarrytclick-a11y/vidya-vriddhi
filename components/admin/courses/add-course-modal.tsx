'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/loading'
import { useState } from 'react'
import { CourseFormData } from '@/hooks/useAdminCourses'
import { generateSlug } from '@/lib/utils'

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CourseFormData) => Promise<void>
}

export function AddCourseModal({ isOpen, onClose, onSubmit }: AddCourseModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    slug: '',
    description: '',
    active: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a course name')
      return
    }
    
    if (!formData.slug.trim()) {
      alert('Please enter a course slug')
      return
    }

    setIsCreating(true)
    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        name: '',
        slug: '',
        description: '',
        active: false,
      })
    } catch (error) {
      console.error('Failed to create course:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug">Course Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Course slug will auto-generate from name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 min-h-[120px]"
                placeholder="Enter course description"
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
