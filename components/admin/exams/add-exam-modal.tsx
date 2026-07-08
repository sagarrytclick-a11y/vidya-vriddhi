'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingButton } from '@/components/ui/loading'
import { useState, useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'

interface AddExamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExamFormData) => Promise<void>
  isSubmitting?: boolean
  initialData?: any
  isEdit?: boolean
}

export interface ExamFormData {
  name: string
  slug: string
  shortName: string
  description: string
  conductingBody: string
  examType: 'NATIONAL' | 'STATE' | 'UNIVERSITY' | 'INTERNATIONAL'
  examMode: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  frequency: 'ONCE_A_YEAR' | 'TWICE_A_YEAR' | 'QUARTERLY' | 'MONTHLY'
  active: boolean
  examImageurl: string
  overview: {
    title: string
    content: string
    keyHighlights: string[]
  }
  registration: {
    title: string
    description: string
    bulletPoints: string[]
  }
  examPattern: {
    title: string
    description: string
    totalDurationMins: number
    scoreRange: string
    tableData: {
      section: string
      questions: number
      durationMins: number
    }[]
  }
  examDates: {
    title: string
    importantDates: {
      event: string
      date: string
    }[]
  }
  resultStatistics: {
    title: string
    description: string
    passingCriteria: string
    totalMarks: number
  }
}

export function AddExamModal({ isOpen, onClose, onSubmit, isSubmitting = false, initialData, isEdit = false }: AddExamModalProps) {
  const [formData, setFormData] = useState<ExamFormData>({
    name: '',
    slug: '',
    shortName: '',
    description: '',
    conductingBody: '',
    examType: 'NATIONAL',
    examMode: 'ONLINE',
    frequency: 'ONCE_A_YEAR',
    active: false,
    examImageurl: '',
    overview: {
      title: 'Overview',
      content: '',
      keyHighlights: []
    },
    registration: {
      title: 'Registration',
      description: '',
      bulletPoints: []
    },
    examPattern: {
      title: 'Exam Pattern',
      description: '',
      totalDurationMins: 0,
      scoreRange: '',
      tableData: []
    },
    examDates: {
      title: 'Important Dates',
      importantDates: []
    },
    resultStatistics: {
      title: 'Result Statistics',
      description: '',
      passingCriteria: '',
      totalMarks: 0
    }
  })
  
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        shortName: initialData.shortName || '',
        description: initialData.description || '',
        conductingBody: initialData.conductingBody || '',
        examType: initialData.examType || 'NATIONAL',
        examMode: initialData.examMode || 'ONLINE',
        frequency: initialData.frequency || 'ONCE_A_YEAR',
        active: initialData.active !== undefined ? initialData.active : false,
        examImageurl: initialData.examImageurl || '',
        overview: {
          title: initialData.overview?.title || 'Overview',
          content: initialData.overview?.content || '',
          keyHighlights: initialData.overview?.keyHighlights || []
        },
        registration: {
          title: initialData.registration?.title || 'Registration',
          description: initialData.registration?.description || '',
          bulletPoints: initialData.registration?.bulletPoints || []
        },
        examPattern: {
          title: initialData.examPattern?.title || 'Exam Pattern',
          description: initialData.examPattern?.description || '',
          totalDurationMins: initialData.examPattern?.totalDurationMins || 0,
          scoreRange: initialData.examPattern?.scoreRange || '',
          tableData: initialData.examPattern?.tableData || []
        },
        examDates: {
          title: initialData.examDates?.title || 'Important Dates',
          importantDates: initialData.examDates?.importantDates || []
        },
        resultStatistics: {
          title: initialData.resultStatistics?.title || 'Result Statistics',
          description: initialData.resultStatistics?.description || '',
          passingCriteria: initialData.resultStatistics?.passingCriteria || '',
          totalMarks: initialData.resultStatistics?.totalMarks || 0
        }
      })
      
      if (initialData.examImageurl) {
        setUploadedImage(initialData.examImageurl)
      }
    }
  }, [initialData, isEdit])

  // Reset form when modal opens for add mode
  useEffect(() => {
    if (isOpen && !isEdit) {
      resetForm()
    }
  }, [isOpen, isEdit])


  const handleImageUpload = async (file: File) => {
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB')
      return
    }
    
    setUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      setUploadedImage(data.url)
      setFormData(prev => ({ ...prev, examImageurl: data.url }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }
  
  const removeUploadedImage = () => {
    setUploadedImage(null)
    setFormData(prev => ({ ...prev, examImageurl: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter an exam name')
      return
    }

    try {
      await onSubmit(formData)
      onClose()
      resetForm()
    } catch (error) {
      console.error('Failed to create exam:', error)
      alert('Failed to create exam')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      shortName: '',
      description: '',
      conductingBody: '',
      examType: 'NATIONAL',
      examMode: 'ONLINE',
      frequency: 'ONCE_A_YEAR',
      active: false,
      examImageurl: '',
      overview: {
        title: 'Overview',
        content: '',
        keyHighlights: []
      },
      registration: {
        title: 'Registration',
        description: '',
        bulletPoints: []
      },
      examPattern: {
        title: 'Exam Pattern',
        description: '',
        totalDurationMins: 0,
        scoreRange: '',
        tableData: []
      },
      examDates: {
        title: 'Important Dates',
        importantDates: []
      },
      resultStatistics: {
        title: 'Result Statistics',
        description: '',
        passingCriteria: '',
        totalMarks: 0
      }
    })
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addKeyHighlight = () => {
    setFormData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        keyHighlights: [...prev.overview.keyHighlights, '']
      }
    }))
  }

  const updateKeyHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        keyHighlights: prev.overview.keyHighlights.map((highlight, i) => 
          i === index ? value : highlight
        )
      }
    }))
  }

  const removeKeyHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        keyHighlights: prev.overview.keyHighlights.filter((_, i) => i !== index)
      }
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      // Add new highlight if current one is not empty
      const currentHighlights = formData.overview.keyHighlights
      if (currentHighlights[index].trim()) {
        addKeyHighlight()
        // Focus on the new input after a short delay
        setTimeout(() => {
          const inputs = document.querySelectorAll('.key-highlight-input')
          if (inputs[index + 1]) {
            (inputs[index + 1] as HTMLInputElement).focus()
          }
        }, 100)
      }
    }
  }

  const addBulletPoint = () => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        bulletPoints: [...prev.registration.bulletPoints, '']
      }
    }))
  }

  const updateBulletPoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        bulletPoints: prev.registration.bulletPoints.map((point, i) => 
          i === index ? value : point
        )
      }
    }))
  }

  const removeBulletPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      registration: {
        ...prev.registration,
        bulletPoints: prev.registration.bulletPoints.filter((_, i) => i !== index)
      }
    }))
  }

  const handleBulletKeyPress = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      // Add new bullet point if current one is not empty
      const currentBulletPoints = formData.registration.bulletPoints
      if (currentBulletPoints[index].trim()) {
        addBulletPoint()
        // Focus on the new input after a short delay
        setTimeout(() => {
          const inputs = document.querySelectorAll('.bullet-point-input')
          if (inputs[index + 1]) {
            (inputs[index + 1] as HTMLInputElement).focus()
          }
        }, 100)
      }
    }
  }

  const addExamPatternRow = () => {
    setFormData(prev => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        tableData: [...prev.examPattern.tableData, { section: '', questions: 0, durationMins: 0 }]
      }
    }))
  }

  const updateExamPatternRow = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        tableData: prev.examPattern.tableData.map((row, i) => 
          i === index ? { ...row, [field]: value } : row
        )
      }
    }))
  }

  const removeExamPatternRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examPattern: {
        ...prev.examPattern,
        tableData: prev.examPattern.tableData.filter((_, i) => i !== index)
      }
    }))
  }

  const addImportantDate = () => {
    setFormData(prev => ({
      ...prev,
      examDates: {
        ...prev.examDates,
        importantDates: [...prev.examDates.importantDates, { event: '', date: '' }]
      }
    }))
  }

  const updateImportantDate = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      examDates: {
        ...prev.examDates,
        importantDates: prev.examDates.importantDates.map((date, i) => 
          i === index ? { ...date, [field]: value } : date
        )
      }
    }))
  }

  const removeImportantDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      examDates: {
        ...prev.examDates,
        importantDates: prev.examDates.importantDates.filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Edit the details of the existing exam.' : 'Fill in the details to create a new exam.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6" key={isEdit ? `edit-${initialData?.id}` : 'add-new'}>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Exam Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter exam name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., JEE, NEET"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="exam-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="conductingBody">Conducting Body</Label>
                <Input
                  id="conductingBody"
                  value={formData.conductingBody}
                  onChange={(e) => setFormData(prev => ({ ...prev, conductingBody: e.target.value }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter conducting body"
                  required
                />
              </div>

              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select value={formData.examType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, examType: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATIONAL">National</SelectItem>
                    <SelectItem value="STATE">State</SelectItem>
                    <SelectItem value="UNIVERSITY">University</SelectItem>
                    <SelectItem value="INTERNATIONAL">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="examMode">Exam Mode</Label>
                <Select value={formData.examMode} onValueChange={(value: any) => setFormData(prev => ({ ...prev, examMode: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select exam mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONCE_A_YEAR">Once a year</SelectItem>
                    <SelectItem value="TWICE_A_YEAR">Twice a year</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter exam description"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Exam Image */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Exam Image</h3>
            </div>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="examImage"
                />
                <label
                  htmlFor="examImage"
                  className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors"
                >
                  {uploadingImage ? (
                    <LoadingButton text="Uploading to ImageKit..." size="md" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-300">Click to upload exam image</span>
                    </>
                  )}
                  <span className="text-xs text-slate-500 mt-1">
                    PNG, JPG, GIF up to 5MB • Powered by ImageKit
                  </span>
                </label>
              </div>
              
              {(uploadedImage || formData.examImageurl) && (
                <div className="relative group">
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="relative w-16 h-16 bg-slate-600 rounded overflow-hidden shrink-0">
                      <NextImage
                        src={uploadedImage || formData.examImageurl || ''}
                        alt="Exam preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-slate-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white truncate">
{uploadedImage || formData.examImageurl || ''}
                      </p>
                      <p className="text-xs text-slate-400">Image uploaded to ImageKit</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedImage}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-xs text-slate-400">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>
              
              <Input
                type="url"
                value={formData.examImageurl}
                onChange={(e) => setFormData(prev => ({ ...prev, examImageurl: e.target.value }))}
                className="bg-slate-700 border-slate-600"
                placeholder="https://example.com/exam-image.jpg"
              />
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Overview</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="overviewTitle" className="text-sm font-medium text-gray-300">Section Title</Label>
                <Input
                  id="overviewTitle"
                  value={formData.overview.title}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                  placeholder="Overview"
                />
                <p className="text-xs text-slate-500 mt-1">Overview section title is fixed</p>
              </div>

              <div>
                <Label htmlFor="overviewContent" className="text-sm font-medium text-gray-300">Overview Content</Label>
                <Textarea
                  id="overviewContent"
                  value={formData.overview.content}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    overview: { ...prev.overview, content: e.target.value }
                  }))}
                  className="bg-slate-700 border-slate-600 focus:border-teal-500 transition-colors"
                  placeholder="Provide a comprehensive overview of the exam, including its purpose, significance, and what students can expect..."
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-1">Describe the exam in detail (minimum 50 characters recommended)</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-white">Key Highlights</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={addKeyHighlight} 
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Highlight
                    </Button>
                    {formData.overview.keyHighlights.length > 0 && (
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          overview: {
                            ...prev.overview,
                            keyHighlights: []
                          }
                        }))}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                
                {formData.overview.keyHighlights.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
                    <p className="text-slate-400 text-sm mb-2">No key highlights added yet</p>
                    <p className="text-slate-500 text-xs">Click "Add Highlight" to add key features of this exam</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.overview.keyHighlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2 items-center group">
                        <div className="flex-1 relative">
                          <Input
                            value={highlight}
                            onChange={(e) => updateKeyHighlight(index, e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            className="key-highlight-input bg-slate-700 border-slate-600 focus:border-teal-500 transition-colors"
                            placeholder={`Enter key highlight ${index + 1}...`}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                            {index + 1}
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeKeyHighlight(index)}
                          variant="outline"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-slate-500">
                        {formData.overview.keyHighlights.length} highlight{formData.overview.keyHighlights.length !== 1 ? 's' : ''} added
                      </p>
                      <p className="text-xs text-slate-500">
                        Press Enter to add new highlight
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Registration</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="registrationTitle" className="text-sm font-medium text-gray-300">Section Title</Label>
                  <Input
                    id="registrationTitle"
                    value={formData.registration.title}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                    placeholder="Registration"
                  />
                  <p className="text-xs text-slate-500 mt-1">Registration section title is fixed</p>
                </div>
              </div>

              <div>
                <Label htmlFor="registrationDescription">Registration Description</Label>
                <Textarea
                  id="registrationDescription"
                  value={formData.registration.description}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    registration: { ...prev.registration, description: e.target.value }
                  }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter registration description"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-white">Bullet Points</Label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={addBulletPoint} 
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Bullet
                    </Button>
                    {formData.registration.bulletPoints.length > 0 && (
                      <Button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          registration: {
                            ...prev.registration,
                            bulletPoints: []
                          }
                        }))}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>
                
                {formData.registration.bulletPoints.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
                    <p className="text-slate-400 text-sm mb-2">No bullet points added yet</p>
                    <p className="text-slate-500 text-xs">Add key registration information and requirements</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.registration.bulletPoints.map((point, index) => (
                      <div key={index} className="flex gap-2 items-center group">
                        <div className="flex-1 relative">
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 text-sm">
                            •
                          </div>
                          <Input
                            value={point}
                            onChange={(e) => updateBulletPoint(index, e.target.value)}
                            onKeyPress={(e) => handleBulletKeyPress(e, index)}
                            className="bullet-point-input bg-slate-700 border-slate-600 focus:border-teal-500 transition-colors pl-8"
                            placeholder={`Enter bullet point ${index + 1}...`}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-500">
                            {index + 1}
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeBulletPoint(index)}
                          variant="outline"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-slate-500">
                        {formData.registration.bulletPoints.length} bullet point{formData.registration.bulletPoints.length !== 1 ? 's' : ''} added
                      </p>
                      <p className="text-xs text-slate-500">
                        Press Enter to add new bullet point
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Pattern */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Exam Pattern</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patternTitle" className="text-sm font-medium text-gray-300">Section Title</Label>
                  <Input
                    id="patternTitle"
                    value={formData.examPattern.title}
                    readOnly
                    className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                    placeholder="Exam Pattern"
                  />
                  <p className="text-xs text-slate-500 mt-1">Exam Pattern section title is fixed</p>
                </div>

                <div>
                  <Label htmlFor="scoreRange">Score Range</Label>
                  <Input
                    id="scoreRange"
                    value={formData.examPattern.scoreRange}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      examPattern: { ...prev.examPattern, scoreRange: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., 0-300"
                  />
                </div>

                <div>
                  <Label htmlFor="totalDuration">Total Duration (minutes)</Label>
                  <Input
                    id="totalDuration"
                    type="number"
                    value={formData.examPattern.totalDurationMins}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      examPattern: { ...prev.examPattern, totalDurationMins: parseInt(e.target.value) || 0 }
                    }))}
                    className="bg-slate-700 border-slate-600"
                    placeholder="180"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="patternDescription">Pattern Description</Label>
                <Textarea
                  id="patternDescription"
                  value={formData.examPattern.description}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    examPattern: { ...prev.examPattern, description: e.target.value }
                  }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter exam pattern description"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white font-medium">Exam Pattern Sections</Label>
                  <Button type="button" onClick={addExamPatternRow} size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Section
                  </Button>
                </div>
                {formData.examPattern.tableData.map((row, index) => (
                  <div key={index} className="bg-slate-700/50 p-3 rounded-lg mb-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor={`section-${index}`} className="text-xs text-gray-300 block mb-1">Section Name</Label>
                        <Input
                          id={`section-${index}`}
                          value={row.section}
                          onChange={(e) => updateExamPatternRow(index, 'section', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder="e.g., Mathematics, Physics, Chemistry"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`questions-${index}`} className="text-xs text-gray-300 block mb-1">Questions</Label>
                        <Input
                          id={`questions-${index}`}
                          type="number"
                          value={row.questions}
                          onChange={(e) => updateExamPatternRow(index, 'questions', parseInt(e.target.value) || 0)}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder="50"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`duration-${index}`} className="text-xs text-gray-300 block mb-1">Duration (min)</Label>
                        <Input
                          id={`duration-${index}`}
                          type="number"
                          value={row.durationMins}
                          onChange={(e) => updateExamPatternRow(index, 'durationMins', parseInt(e.target.value) || 0)}
                          className="bg-slate-600 border-slate-500 text-white"
                          placeholder="60"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={() => removeExamPatternRow(index)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exam Dates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Important Dates</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="datesTitle" className="text-sm font-medium text-gray-300">Section Title</Label>
                <Input
                  id="datesTitle"
                  value={formData.examDates.title}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                  placeholder="Important Dates"
                />
                <p className="text-xs text-slate-500 mt-1">Important Dates section title is fixed</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Important Dates</Label>
                  <Button type="button" onClick={addImportantDate} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Date
                  </Button>
                </div>
                {formData.examDates.importantDates.map((date, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      value={date.event}
                      onChange={(e) => updateImportantDate(index, 'event', e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Event name"
                    />
                    <Input
                      type="date"
                      value={date.date}
                      onChange={(e) => updateImportantDate(index, 'date', e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImportantDate(index)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Result Statistics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-white">Result Statistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="statsTitle" className="text-sm font-medium text-gray-300">Section Title</Label>
                <Input
                  id="statsTitle"
                  value={formData.resultStatistics.title}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-gray-400 cursor-not-allowed"
                  placeholder="Result Statistics"
                />
                <p className="text-xs text-slate-500 mt-1">Result Statistics section title is fixed</p>
              </div>

              <div>
                <Label htmlFor="passingCriteria">Passing Criteria</Label>
                <Input
                  id="passingCriteria"
                  value={formData.resultStatistics.passingCriteria}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    resultStatistics: { ...prev.resultStatistics, passingCriteria: e.target.value }
                  }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., 40% or above"
                />
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.resultStatistics.totalMarks}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    resultStatistics: { ...prev.resultStatistics, totalMarks: parseInt(e.target.value) || 0 }
                  }))}
                  className="bg-slate-700 border-slate-600"
                  placeholder="400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statsDescription">Statistics Description</Label>
              <Textarea
                id="statsDescription"
                value={formData.resultStatistics.description}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  resultStatistics: { ...prev.resultStatistics, description: e.target.value }
                }))}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter result statistics description"
                rows={3}
              />
            </div>
          </div>

          {/* Exam Status */}
          <div className="border-t border-slate-600 pt-6">
            <div className="flex items-center space-x-3 bg-slate-700/50 p-4 rounded-lg">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked as boolean }))}
                className="w-5 h-5"
              />
              <Label htmlFor="active" className="text-white font-medium cursor-pointer">
                Active Exam
              </Label>
              <span className="text-xs text-slate-400 ml-2">
                (Check to make this exam visible to users)
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Exam' : 'Create Exam')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
