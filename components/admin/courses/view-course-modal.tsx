'use client'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Course } from '@/hooks/useAdminCourses'
import { Calendar, Eye, Building } from 'lucide-react'
import {
  adminViewDialogClass,
  adminViewHeaderClass,
  adminViewBodyClass,
} from '@/components/admin/modal-ui'

interface ViewCourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export function ViewCourseModal({ isOpen, onClose, course }: ViewCourseModalProps) {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminViewDialogClass, "max-w-4xl")}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Course Details
          </DialogTitle>
        </DialogHeader>

        <div className={cn(adminViewBodyClass, "space-y-6")}>
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{course.name}</h2>
                <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant={course.active ? "default" : "secondary"}>
                    {course.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-4">
                <p className="text-[#9ca3af] whitespace-pre-wrap">
                  {course.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Associated Colleges */}
          {(course._count?.colleges ?? course.colleges?.length ?? 0) > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Associated Colleges</h3>
                <div className="rounded-xl bg-[#0c0f14] border border-white/6 p-4">
                  {course.colleges && course.colleges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {course.colleges.map((college) => (
                        <Badge key={college.id} variant="outline" className="border-white/10 text-[#9ca3af]">
                          <Building className="h-3 w-3 mr-1" />
                          {college.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300">{course._count?.colleges} college(s) linked</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/6">
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Slug</label>
              <p className="text-white mt-1">{course.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Status</label>
              <div className="mt-1">
                <Badge variant={course.active ? "default" : "secondary"}>
                  {course.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Created</label>
              <p className="text-white mt-1">
                {new Date(course.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#6b7280]">Last Updated</label>
              <p className="text-white mt-1">
                {new Date(course.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {(course._count?.colleges ?? course.colleges?.length ?? 0) > 0 && (
            <div className="pt-4 border-t border-white/6">
              <label className="text-sm font-medium text-[#6b7280]">Associated Colleges Count</label>
              <p className="text-white mt-1">{course._count?.colleges ?? course.colleges?.length} college(s)</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
