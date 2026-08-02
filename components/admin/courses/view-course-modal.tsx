'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Course } from '@/hooks/useAdminCourses'
import { Calendar, Eye, Building } from 'lucide-react'

interface ViewCourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: Course | null
}

export function ViewCourseModal({ isOpen, onClose, course }: ViewCourseModalProps) {
  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Course Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{course.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
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
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-gray-300 whitespace-pre-wrap">
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
                <div className="bg-slate-700 rounded-lg p-4">
                  {course.colleges && course.colleges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {course.colleges.map((college) => (
                        <Badge key={college.id} variant="outline" className="border-slate-600 text-gray-300">
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <label className="text-sm font-medium text-gray-400">Slug</label>
              <p className="text-white mt-1">{course.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Status</label>
              <p className="text-white mt-1">
                <Badge variant={course.active ? "default" : "secondary"}>
                  {course.active ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Created</label>
              <p className="text-white mt-1">
                {new Date(course.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Last Updated</label>
              <p className="text-white mt-1">
                {new Date(course.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {(course._count?.colleges ?? course.colleges?.length ?? 0) > 0 && (
            <div className="pt-4 border-t border-slate-700">
              <label className="text-sm font-medium text-gray-400">Associated Colleges Count</label>
              <p className="text-white mt-1">{course._count?.colleges ?? course.colleges?.length} college(s)</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
