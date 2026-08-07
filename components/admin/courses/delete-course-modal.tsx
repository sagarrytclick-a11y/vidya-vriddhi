
'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useAdminCourses } from '@/hooks/useAdminCourses'
import { Course } from '@/hooks/useAdminCourses'
import {
  adminDialogClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'

interface DeleteCourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export function DeleteCourseModal({ isOpen, onClose, course }: DeleteCourseModalProps) {
  const { deleteCourse, isDeleting } = useAdminCourses()

  const handleDelete = async () => {
    if (!course) return

    try {
      await deleteCourse(course.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete course:', error)
      // Error is already handled by the hook with toast notification
    }
  }

  if (!course) return null

  const collegeCount = course._count?.colleges ?? course.colleges?.length ?? 0
  const hasAssociatedColleges = collegeCount > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminDialogClass, "max-w-md")}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Course
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {hasAssociatedColleges ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
              <p className="text-red-300 text-sm">
                Cannot delete course 
                <span className="font-semibold text-white mx-1">"{course.name}"</span>
                because it has associated colleges.
              </p>
              <p className="text-rose-400 text-xs mt-2">
                Please remove all associated colleges before deleting this course.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
                <p className="text-red-300 text-sm">
                  Are you sure you want to delete the course 
                  <span className="font-semibold text-white mx-1">"{course.name}"</span>?
                </p>
                <p className="text-rose-400 text-xs mt-2">
                  This action cannot be undone. The course will be permanently removed from the system.
                </p>
              </div>
            </>
          )}

          <div className="rounded-xl bg-[#0c0f14]/80 border border-white/6 p-3">
            <p className="text-[#9ca3af] text-sm">
              <strong>Course:</strong> {course.name}
            </p>
            <p className="text-[#9ca3af] text-sm">
              <strong>Slug:</strong> {course.slug}
            </p>
            {hasAssociatedColleges && (
              <p className="text-[#9ca3af] text-sm">
                <strong>Associated Colleges:</strong> {collegeCount}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className={adminCancelBtnClass}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || hasAssociatedColleges}
            className={adminDangerBtnClass}
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
