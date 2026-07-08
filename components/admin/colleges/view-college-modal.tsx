'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import NextImage from 'next/image'
import { Calendar, MapPin, Globe, Award, ImageIcon, FileText, DollarSign, GraduationCap, Users, CheckCircle, XCircle } from 'lucide-react'

interface ViewCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  college: any
  onEdit?: (college: any) => void
  onDelete?: (college: any) => void
}

export function ViewCollegeModal({ isOpen, onClose, college, onEdit, onDelete }: ViewCollegeModalProps) {
  if (!college) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{college.name}</span>
            <div className="flex gap-2">
              {college.active ? (
                <Badge variant="default" className="bg-green-900 text-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex gap-6">
            {college.logoURL && (
              <div className="shrink-0">
                <NextImage
                  src={college.logoURL}
                  alt={`${college.name} logo`}
                  width={96}
                  height={96}
                  className="object-contain rounded-lg border"
                />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{college.name}</h2>
              {college.description && (
                <p className="text-gray-300 mb-4">{college.description}</p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {college.features?.map((feature: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs bg-slate-700 border-slate-600 text-white">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            {college.imageURL && (
              <div className="shrink-0">
                <NextImage
                  src={college.imageURL}
                  alt={`${college.name} image`}
                  width={128}
                  height={96}
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="font-medium">Country:</span>
              <span>{college.country?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-medium">City:</span>
              <span>{college.city?.name || 'N/A'}</span>
            </div>
            {college.establishment_year && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Established:</span>
                <span>{college.establishment_year}</span>
              </div>
            )}
            {college.Countryranking && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Award className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Country Ranking:</span>
                <span>#{college.Countryranking}</span>
              </div>
            )}
            {college.Internationalranking && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="font-medium">International Ranking:</span>
                <span>#{college.Internationalranking}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="font-medium">Slug:</span>
              <span className="text-gray-400">/{college.slug}</span>
            </div>
          </div>

          {/* JSON Data Sections */}
          {college.documentsRequired && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                Documents Required
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(college.documentsRequired, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {college.feesStructure && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Fees Structure
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(college.feesStructure, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {college.admissionProcess && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <GraduationCap className="w-5 h-5" />
                Admission Process
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(college.admissionProcess, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {college.whyChooseUs && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <CheckCircle className="w-5 h-5" />
                Why Choose Us
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(college.whyChooseUs, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {college.galleryImages && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <ImageIcon className="w-5 h-5" />
                Gallery Images
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(college.galleryImages, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Related Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-teal-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-teal-300" />
                <h4 className="font-semibold text-teal-100">Categories</h4>
              </div>
              <p className="text-2xl font-bold text-teal-100">{college.categories?.length || college._count?.categories || 0}</p>
              <p className="text-sm text-teal-300">Associated categories</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-green-300" />
                <h4 className="font-semibold text-green-100">Courses</h4>
              </div>
              <p className="text-2xl font-bold text-green-100">{college.courses?.length || college._count?.courses || 0}</p>
              <p className="text-sm text-green-300">Available courses</p>
            </div>
            <div className="bg-purple-900 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-purple-300" />
                <h4 className="font-semibold text-purple-100">Exams</h4>
              </div>
              <p className="text-2xl font-bold text-purple-100">{college.exams?.length || college._count?.exams || 0}</p>
              <p className="text-sm text-purple-300">Accepted exams</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <span className="font-medium">Created:</span> {formatDate(college.createdAt)}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {formatDate(college.updatedAt)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(college)} className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                Edit College
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => onDelete(college)} className="bg-red-600 hover:bg-red-700 text-white">
                Delete College
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
