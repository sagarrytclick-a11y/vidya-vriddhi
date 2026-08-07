'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useEffect } from 'react'
import { useAdminCourses, Course, CourseFormData } from '@/hooks/useAdminCourses'
import { cn, generateSlug } from '@/lib/utils'
import {
  adminCheckboxClass,
  adminDialogClass,
  adminFieldClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  onUpdate: (id: string, data: Partial<CourseFormData>) => Promise<void>
  isUpdating?: boolean
}

export function EditCourseModal({ isOpen, onClose, course, onUpdate, isUpdating = false }: EditCourseModalProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    slug: '',
    description: '',
    active: false,
  })

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        slug: course.slug,
        description: course.description || '',
        active: course.active,
      })
    }
  }, [course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!course) return
    
    if (!formData.name.trim()) {
      alert('Please enter a course name')
      return
    }
    
    if (!formData.slug.trim()) {
      alert('Please enter a course slug')
      return
    }

    try {
      await onUpdate(course.id, formData)
      onClose()
    } catch (error) {
      console.error('Failed to update course:', error)
    }
  }

  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-2xl")}>
        <DialogHeader>
          <DialogTitle className="text-white">Edit Course</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name" className={adminLabelClass}>Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                }))}
                className={adminFieldClass}
                placeholder="Enter course name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="slug" className={adminLabelClass}>Course Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className={adminFieldClass}
                placeholder="Course slug will auto-generate from name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description" className={adminLabelClass}>Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={cn(adminFieldClass, "min-h-[120px]")}
                placeholder="Enter course description"
              />
            </div>

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, active: checked }))}
                  className={adminCheckboxClass}
                />
                <Label htmlFor="active" className={adminLabelClass}>Active</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className={adminCancelBtnClass}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className={adminPrimaryBtnClass}>
              {isUpdating ? 'Updating...' : 'Update Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
