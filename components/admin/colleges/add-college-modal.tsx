'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useRef, useEffect } from 'react'
import NextImage from 'next/image'
import { Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import { CollegeFormData } from '@/types/college'
import { toast } from 'sonner'

interface AddCollegeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CollegeFormData) => Promise<void>
  isSubmitting?: boolean
  initialData?: any
  isEdit?: boolean
  countries?: any[]
  cities?: any[]
}

export function AddCollegeModal({ isOpen, onClose, onSubmit, isSubmitting = false, initialData, isEdit = false, countries = [], cities = [] }: AddCollegeModalProps) {
  const getInitialFormData = () => {
    if (initialData && isEdit) {
      return {
        // Basic fields
        name: initialData.name || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        establishment_year: initialData.establishment_year || undefined,
        Countryranking: initialData.Countryranking || undefined,
        Internationalranking: initialData.Internationalranking || undefined,
        active: initialData.active !== undefined ? initialData.active : false,
        features: initialData.features || [],
        logoURL: initialData.logoURL || '',
        imageURL: initialData.imageURL || '',
        
        // JSON fields with proper defaults
        keyHighlights: initialData.keyHighlights || {
          title: "Key Highlights",
          description: "",
          features: []
        },
        documentsRequired: initialData.documentsRequired || {
          title: "Documents Required",
          description: "",
          documents: []
        },
        feesStructure: initialData.feesStructure || {
          title: "Fees Structure",
          description: "",
          courses: []
        },
        admissionProcess: initialData.admissionProcess || {
          title: "Admission Process",
          description: "",
          steps: []
        },
        whyChooseUs: initialData.whyChooseUs || {
          title: "Why Choose Us",
          description: "",
          features: []
        },
        campusHighlights: initialData.campusHighlights || {
          title: "Campus Highlights",
          description: "",
          highlights: []
        },
        
        // Relations - ensure proper mapping from objects to IDs
        countryId: initialData.countryId || initialData.country?.id || '',
        cityId: initialData.cityId || initialData.city?.id || '',
        exams: initialData.exams?.map((exam: any) => exam.id || exam).filter(Boolean) || [],
        categories: initialData.categories?.map((cat: any) => cat.id || cat).filter(Boolean) || [],
        courses: initialData.courses?.map((course: any) => course.id || course).filter(Boolean) || []
      }
    }
    
    // Default form data for create mode
    return {
      name: '',
      slug: '',
      description: '',
      establishment_year: undefined,
      Countryranking: undefined,
      Internationalranking: undefined,
      active: false,
      features: [],
      logoURL: '',
      imageURL: '',
      keyHighlights: {
        title: "Key Highlights",
        description: "",
        features: []
      },
      documentsRequired: {
        title: "Documents Required",
        description: "",
        documents: []
      },
      feesStructure: {
        title: "Fees Structure",
        description: "",
        courses: []
      },
      admissionProcess: {
        title: "Admission Process",
        description: "",
        steps: []
      },
      whyChooseUs: {
        title: "Why Choose Us",
        description: "",
        features: []
      },
      campusHighlights: {
        title: "Campus Highlights",
        description: "",
        highlights: []
      },
      countryId: '',
      cityId: '',
      exams: [],
      categories: [],
      courses: []
    }
  }

  const [formData, setFormData] = useState<CollegeFormData>(getInitialFormData())

  const [newFeature, setNewFeature] = useState('')
  const [newKeyHighlightFeature, setNewKeyHighlightFeature] = useState('')
  const [newDocument, setNewDocument] = useState('')
  const [newCourse, setNewCourse] = useState({ course_name: '', duration: '', annual_tuition_fee: '' })
  const [newWhyChooseUsFeature, setNewWhyChooseUsFeature] = useState({ title: '', description: '' })
  const [newAdmissionStep, setNewAdmissionStep] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const campusImageInputRef = useRef<HTMLInputElement>(null)
  
  // Dynamic data states
  const [exams, setExams] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [allCities, setAllCities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (isOpen) {
      const newFormData = getInitialFormData()
      setFormData(newFormData)
    }
  }, [initialData, isEdit, isOpen])

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !isEdit) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, isEdit])

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch exams
        const examsResponse = await fetch('/api/exams')
        if (examsResponse.ok) {
          const examsData = await examsResponse.json()
          // API returns { data: [...], pagination: {...} }
          const examsArray = examsData.data || []
          setExams(Array.isArray(examsArray) ? examsArray : [])
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories?limit=100')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          // API returns { data: [...], pagination: {...} }
          const categoriesArray = categoriesData.data || []
          setCategories(Array.isArray(categoriesArray) ? categoriesArray : [])
        } else {
          console.error('Categories fetch failed:', categoriesResponse.status)
        }

        // Fetch courses
        const coursesResponse = await fetch('/api/courses')
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          // API returns { data: [...], pagination: {...} }
          const coursesArray = coursesData.data || []
          setCourses(Array.isArray(coursesArray) ? coursesArray : [])
        }

        // Fetch all cities (no pagination limit)
        const citiesResponse = await fetch('/api/cities?limit=100')
        if (citiesResponse.ok) {
          const citiesData = await citiesResponse.json()
          const citiesArray = citiesData.data || []
          setAllCities(Array.isArray(citiesArray) ? citiesArray : [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('College name is required')
      return
    }
    if (!formData.slug.trim()) {
      toast.error('Slug is required')
      return
    }
    if (!formData.countryId) {
      toast.error('Please select a country')
      return
    }
    if (!formData.cityId) {
      toast.error('Please select a city')
      return
    }
    
    try {
      await onSubmit(formData)
      const action = isEdit ? 'updated' : 'created'
      toast.success(`College "${formData.name}" ${action} successfully`)
      onClose()
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} college:`, error)
      toast.error(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} college`)
    }
  }

  const handleInputChange = (field: keyof CollegeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addKeyHighlightFeature = () => {
    if (newKeyHighlightFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        keyHighlights: {
          title: prev.keyHighlights?.title || 'Key Highlights',
          description: prev.keyHighlights?.description || '',
          features: [...(prev.keyHighlights?.features || []), newKeyHighlightFeature.trim()]
        }
      }))
      setNewKeyHighlightFeature('')
    }
  }

  const removeKeyHighlightFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyHighlights: {
        title: prev.keyHighlights?.title || 'Key Highlights',
        description: prev.keyHighlights?.description || '',
        features: (prev.keyHighlights?.features || []).filter((_, i) => i !== index)
      }
    }))
  }

  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documentsRequired: {
          title: prev.documentsRequired?.title || 'Documents Required',
          description: prev.documentsRequired?.description || '',
          documents: [...(prev.documentsRequired?.documents || []), newDocument.trim()]
        }
      }))
      setNewDocument('')
    }
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentsRequired: {
        title: prev.documentsRequired?.title || 'Documents Required',
        description: prev.documentsRequired?.description || '',
        documents: (prev.documentsRequired?.documents || []).filter((_, i) => i !== index)
      }
    }))
  }

  const addCourse = () => {
    if (newCourse.course_name.trim() && newCourse.duration.trim() && newCourse.annual_tuition_fee.trim()) {
      setFormData(prev => ({
        ...prev,
        feesStructure: {
          title: prev.feesStructure?.title || 'Fees Structure',
          description: prev.feesStructure?.description || '',
          courses: [...(prev.feesStructure?.courses || []), { ...newCourse }]
        }
      }))
      setNewCourse({ course_name: '', duration: '', annual_tuition_fee: '' })
    }
  }

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      feesStructure: {
        title: prev.feesStructure?.title || 'Fees Structure',
        description: prev.feesStructure?.description || '',
        courses: (prev.feesStructure?.courses || []).filter((_: any, i: number) => i !== index)
      }
    }))
  }

  const addWhyChooseUsFeature = () => {
    if (newWhyChooseUsFeature.title.trim() && newWhyChooseUsFeature.description.trim()) {
      setFormData(prev => ({
        ...prev,
        whyChooseUs: {
          title: prev.whyChooseUs?.title || 'Why Choose Us',
          description: prev.whyChooseUs?.description || '',
          features: [...(prev.whyChooseUs?.features || []), { ...newWhyChooseUsFeature }]
        }
      }))
      setNewWhyChooseUsFeature({ title: '', description: '' })
    }
  }

  const removeWhyChooseUsFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whyChooseUs: {
        title: prev.whyChooseUs?.title || 'Why Choose Us',
        description: prev.whyChooseUs?.description || '',
        features: (prev.whyChooseUs?.features || []).filter((_: any, i: number) => i !== index)
      }
    }))
  }

  const addAdmissionStep = () => {
    if (newAdmissionStep.trim()) {
      setFormData(prev => ({
        ...prev,
        admissionProcess: {
          ...prev.admissionProcess!,
          title: prev.admissionProcess?.title || 'Admission Process',
          description: prev.admissionProcess?.description || '',
          steps: [...(prev.admissionProcess?.steps || []), newAdmissionStep.trim()]
        }
      }))
      setNewAdmissionStep('')
    }
  }

  const removeAdmissionStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      admissionProcess: {
        ...prev.admissionProcess!,
        title: prev.admissionProcess?.title || 'Admission Process',
        description: prev.admissionProcess?.description || '',
        steps: (prev.admissionProcess?.steps || []).filter((_: string, i: number) => i !== index)
      }
    }))
  }

  const handleCampusImageUpload = async (file: File) => {
    try {
      const url = await uploadToImageKit(file)
      setFormData(prev => ({
        ...prev,
        campusHighlights: {
          ...prev.campusHighlights!,
          title: prev.campusHighlights?.title || 'Campus Highlights',
          description: prev.campusHighlights?.description || '',
          highlights: [...(prev.campusHighlights?.highlights || []), url]
        }
      }))
      toast.success('Campus image uploaded')
    } catch (error) {
      console.error('Campus image upload failed:', error)
      toast.error('Failed to upload campus image. Please try again.')
    }
  }

  const removeCampusHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      campusHighlights: {
        ...prev.campusHighlights!,
        title: prev.campusHighlights?.title || 'Campus Highlights',
        description: prev.campusHighlights?.description || '',
        highlights: (prev.campusHighlights?.highlights || []).filter((_: string, i: number) => i !== index)
      }
    }))
  }

  // ImageKit upload function via server API
  const uploadToImageKit = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleImageUpload = async (file: File, type: 'imageURL' | 'logoURL') => {
    try {
      const url = await uploadToImageKit(file)
      setFormData(prev => ({
        ...prev,
        [type]: url
      }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Failed to upload image. Please try again.')
    }
  }

  const filteredCities = (allCities.length > 0 ? allCities : cities).filter(city => city.countryId === formData.countryId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit College' : 'Add New College'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the college information below.' : 'Fill in the college information below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">College Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter college name"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="college-slug"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-slate-700 border-slate-600"
              placeholder="Enter college description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.countryId} onValueChange={(value) => handleInputChange('countryId', value)} disabled={loading}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder={loading ? "Loading countries..." : "Select country"} />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Select 
                value={formData.cityId || ''} 
                onValueChange={(value) => handleInputChange('cityId', value || undefined)}
                disabled={!formData.countryId || loading}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder={loading ? "Loading cities..." : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredCities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="establishment_year">Establishment Year</Label>
              <Input
                id="establishment_year"
                type="number"
                value={formData.establishment_year || ''}
                onChange={(e) => handleInputChange('establishment_year', e.target.value ? parseInt(e.target.value) || undefined : undefined)}
                className="bg-slate-700 border-slate-600"
                placeholder="e.g., 1950"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
            <div>
              <Label htmlFor="Countryranking">Country Ranking</Label>
              <Input
                id="Countryranking"
                type="number"
                value={formData.Countryranking || ''}
                onChange={(e) => handleInputChange('Countryranking', e.target.value ? parseInt(e.target.value) || undefined : undefined)}
                className="bg-slate-700 border-slate-600"
                placeholder="e.g., 1"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="Internationalranking">International Ranking</Label>
              <Input
                id="Internationalranking"
                type="number"
                value={formData.Internationalranking || ''}
                onChange={(e) => handleInputChange('Internationalranking', e.target.value ? parseInt(e.target.value) || undefined : undefined)}
                className="bg-slate-700 border-slate-600"
                placeholder="e.g., 100"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exams">Exams</Label>
              <div className="space-y-2">
                {exams.map((exam) => (
                  <div key={exam.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exam-${exam.id}`}
                      checked={formData.exams?.includes(exam.id) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('exams', [...(formData.exams || []), exam.id])
                        } else {
                          handleInputChange('exams', formData.exams?.filter(id => id !== exam.id) || [])
                        }
                      }}
                    />
                    <Label htmlFor={`exam-${exam.id}`} className="text-sm text-white">
                      {exam.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="categories">Categories</Label>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-sm text-gray-400">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-gray-400">No categories found. Please add categories first.</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={formData.categories?.includes(category.id) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('categories', [...(formData.categories || []), category.id])
                          } else {
                            handleInputChange('categories', formData.categories?.filter(id => id !== category.id) || [])
                          }
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm text-white">
                        {category.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <Label htmlFor="courses">Courses</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-600 rounded p-3 bg-slate-700">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`course-${course.id}`}
                    checked={formData.courses?.includes(course.id) || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange('courses', [...(formData.courses || []), course.id])
                      } else {
                        handleInputChange('courses', formData.courses?.filter(id => id !== course.id) || [])
                      }
                    }}
                  />
                  <Label htmlFor={`course-${course.id}`} className="text-sm text-white">
                    {course.name}
                  </Label>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-sm text-gray-400">No courses available</p>
              )}
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                  <span className="text-sm text-white">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="h-4 w-4 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageURL">College Image</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'imageURL')
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {formData.imageURL && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('imageURL', '')}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.imageURL && (
                <div className="mt-2">
                  <NextImage
                    src={formData.imageURL}
                    alt="College image"
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="logoURL">Logo</Label>
              <div className="flex gap-2">
                <Input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'logoURL')
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
                {formData.logoURL && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('logoURL', '')}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.logoURL && (
                <div className="mt-2">
                  <NextImage
                    src={formData.logoURL}
                    alt="College logo"
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Key Highlights Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Highlights Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="keyHighlights_title">Title</Label>
                <Input
                  id="keyHighlights_title"
                  value="Key Highlights"
                  disabled
                  className="bg-slate-700 border-slate-600 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="keyHighlights_description">Description</Label>
                <Textarea
                  id="keyHighlights_description"
                  value={formData.keyHighlights?.description || ''}
                  onChange={(e) => handleInputChange('keyHighlights', {
                    ...formData.keyHighlights!,
                    description: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter key highlights description"
                  rows={3}
                />
              </div>
              <div>
                <Label>Key Highlights Features</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newKeyHighlightFeature}
                      onChange={(e) => setNewKeyHighlightFeature(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Add a key highlight feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyHighlightFeature())}
                    />
                    <Button type="button" onClick={addKeyHighlightFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.keyHighlights?.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                        <span className="text-sm text-white">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyHighlightFeature(index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Why Choose Us Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="whyChooseUs_title">Why Choose Us Title</Label>
                <Input
                  id="whyChooseUs_title"
                  value="Why Choose Us"
                  disabled
                  className="bg-slate-700 border-slate-600 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="whyChooseUs_description">Why Choose Us Description</Label>
                <Textarea
                  id="whyChooseUs_description"
                  value={formData.whyChooseUs?.description || ''}
                  onChange={(e) => handleInputChange('whyChooseUs', {
                    ...formData.whyChooseUs!,
                    description: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter description for why choose us"
                  rows={3}
                />
              </div>
              <div>
                <Label>Why Choose Us Features</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={newWhyChooseUsFeature?.title || ''}
                      onChange={(e) => setNewWhyChooseUsFeature({ ...newWhyChooseUsFeature!, title: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Feature title"
                    />
                    <Input
                      value={newWhyChooseUsFeature?.description || ''}
                      onChange={(e) => setNewWhyChooseUsFeature({ ...newWhyChooseUsFeature!, description: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Feature description"
                    />
                  </div>
                  <Button type="button" onClick={addWhyChooseUsFeature} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                  <div className="space-y-2">
                    {formData.whyChooseUs?.features?.map((feature: any, index: number) => (
                      <div key={index} className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{feature.title}</h4>
                            <p className="text-sm text-gray-300">{feature.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWhyChooseUsFeature(index)}
                            className="h-4 w-4 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Required Section */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="documentsRequired_title">Documents Required Title</Label>
              <Input
                id="documentsRequired_title"
                value="Documents Required"
                disabled
                className="bg-slate-700 border-slate-600 text-gray-400"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="documentsRequired_description">Documents Required Description</Label>
              <Textarea
                id="documentsRequired_description"
                value={formData.documentsRequired?.description || ''}
                onChange={(e) => handleInputChange('documentsRequired', {
                  ...formData.documentsRequired!,
                  title: formData.documentsRequired?.title || 'Documents Required',
                  description: e.target.value
                })}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter description for documents required"
                rows={3}
              />
            </div>
            <div>
              <Label>Documents Required List</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Add a required document"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                  />
                  <Button type="button" onClick={addDocument} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.documentsRequired?.documents?.map((document: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                      <span className="text-sm text-white">{document}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fees Structure Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fees Structure Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="feesStructure_title">Fees Structure Title</Label>
                <Input
                  id="feesStructure_title"
                  value="Fees Structure"
                  disabled
                  className="bg-slate-700 border-slate-600 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="feesStructure_description">Fees Structure Description</Label>
                <Textarea
                  id="feesStructure_description"
                  value={formData.feesStructure?.description || ''}
                  onChange={(e) => handleInputChange('feesStructure', {
                    ...formData.feesStructure!,
                    description: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter description for fees structure"
                  rows={3}
                />
              </div>
              <div>
                <Label>Fees Structure Courses</Label>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={newCourse?.course_name || ''}
                      onChange={(e) => setNewCourse({ ...newCourse!, course_name: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Course name"
                    />
                    <Input
                      value={newCourse?.duration || ''}
                      onChange={(e) => setNewCourse({ ...newCourse!, duration: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Duration (e.g., 4 years)"
                    />
                    <Input
                      value={newCourse?.annual_tuition_fee || ''}
                      onChange={(e) => setNewCourse({ ...newCourse!, annual_tuition_fee: e.target.value })}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Annual fee (e.g., $10,000)"
                    />
                  </div>
                  <Button type="button" onClick={addCourse} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                  <div className="space-y-2">
                    {formData.feesStructure?.courses?.map((course: any, index: number) => (
                      <div key={index} className="bg-slate-700 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{course.course_name}</h4>
                            <p className="text-sm text-gray-300">Duration: {course.duration}</p>
                            <p className="text-sm text-gray-300">Annual Tuition: {course.annual_tuition_fee}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCourse(index)}
                            className="h-4 w-4 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Process Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Admission Process Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="admissionProcess_title">Admission Process Title</Label>
                <Input
                  id="admissionProcess_title"
                  value="Admission Process"
                  disabled
                  className="bg-slate-700 border-slate-600 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="admissionProcess_description">Admission Process Description</Label>
                <Textarea
                  id="admissionProcess_description"
                  value={formData.admissionProcess?.description || ''}
                  onChange={(e) => handleInputChange('admissionProcess', {
                    ...formData.admissionProcess!,
                    description: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter description for admission process"
                  rows={3}
                />
              </div>
              <div>
                <Label>Admission Process Steps</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newAdmissionStep}
                      onChange={(e) => setNewAdmissionStep(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                      placeholder="Add an admission step"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAdmissionStep())}
                    />
                    <Button type="button" onClick={addAdmissionStep} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.admissionProcess?.steps?.map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                        <span className="text-sm font-medium text-white">Step {index + 1}:</span>
                        <span className="text-sm text-white">{step}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdmissionStep(index)}
                          className="h-4 w-4 p-0 ml-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Highlights Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Campus Highlights Section</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="campusHighlights_title">Campus Highlights Title</Label>
                <Input
                  id="campusHighlights_title"
                  value="Campus Highlights"
                  disabled
                  className="bg-slate-700 border-slate-600 text-gray-400"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="campusHighlights_description">Campus Highlights Description</Label>
                <Textarea
                  id="campusHighlights_description"
                  value={formData.campusHighlights?.description || ''}
                  onChange={(e) => handleInputChange('campusHighlights', {
                    ...formData.campusHighlights!,
                    description: e.target.value
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter description for campus highlights"
                  rows={3}
                />
              </div>
              <div>
                <Label>Campus Highlights Images</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      ref={campusImageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                        if (files) {
                          Array.from(files).forEach(file => handleCampusImageUpload(file))
                        }
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => campusImageInputRef.current?.click()}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Campus Images
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.campusHighlights?.highlights?.map((highlight: string, index: number) => (
                      <div key={index} className="relative group aspect-video">
                        <NextImage
                          src={highlight}
                          alt={`Campus highlight ${index + 1}`}
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeCampusHighlight(index)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEdit ? 'Update College' : 'Create College'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Helper Components for Array Fields
function KeyHighlightsFeatures({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newFeature, setNewFeature] = useState('')

  const addFeature = () => {
    if (newFeature.trim()) {
      handleInputChange('keyHighlights', {
        ...formData.keyHighlights,
        title: formData.keyHighlights?.title || 'Key Highlights',
        description: formData.keyHighlights?.description || '',
        features: [...(formData.keyHighlights?.features || []), newFeature.trim()]
      })
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    handleInputChange('keyHighlights', {
      ...formData.keyHighlights,
      title: formData.keyHighlights?.title || 'Key Highlights',
      description: formData.keyHighlights?.description || '',
      features: formData.keyHighlights?.features?.filter((_: string, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          className="bg-slate-700 border-slate-600"
          placeholder="Add a feature"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
        />
        <Button type="button" onClick={addFeature} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.keyHighlights?.features?.map((feature: string, index: number) => (
          <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
            <span className="text-sm text-white">{feature}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFeature(index)}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhyChooseUsFeatures({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const addFeature = () => {
    if (newTitle.trim() && newDescription.trim()) {
      handleInputChange('whyChooseUs', {
        ...formData.whyChooseUs,
        title: formData.whyChooseUs?.title || 'Why Choose Us',
        description: formData.whyChooseUs?.description || '',
        features: [...(formData.whyChooseUs?.features || []), { title: newTitle.trim(), description: newDescription.trim() }]
      })
      setNewTitle('')
      setNewDescription('')
    }
  }

  const removeFeature = (index: number) => {
    handleInputChange('whyChooseUs', {
      ...formData.whyChooseUs,
      title: formData.whyChooseUs?.title || 'Why Choose Us',
      description: formData.whyChooseUs?.description || '',
      features: formData.whyChooseUs?.features?.filter((_: any, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="space-y-2 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-slate-700 border-slate-600"
            placeholder="Feature title"
          />
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="bg-slate-700 border-slate-600"
            placeholder="Feature description"
          />
        </div>
        <Button type="button" onClick={addFeature} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
      <div className="space-y-2">
        {formData.whyChooseUs?.features?.map((feature: any, index: number) => (
          <div key={index} className="bg-slate-700 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">{feature.title}</h4>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(index)}
                className="h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RankingAccreditation({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  // Note: This component is not used in the current interface as ranking is handled by direct number inputs
  return null
}

function AdmissionSteps({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newStep, setNewStep] = useState('')

  const addStep = () => {
    if (newStep.trim()) {
      handleInputChange('admissionProcess', {
        ...formData.admissionProcess,
        title: formData.admissionProcess?.title || 'Admission Process',
        description: formData.admissionProcess?.description || '',
        steps: [...(formData.admissionProcess?.steps || []), newStep.trim()]
      })
      setNewStep('')
    }
  }

  const removeStep = (index: number) => {
    handleInputChange('admissionProcess', {
      ...formData.admissionProcess,
      title: formData.admissionProcess?.title || 'Admission Process',
      description: formData.admissionProcess?.description || '',
      steps: formData.admissionProcess?.steps?.filter((_: string, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          className="bg-slate-700 border-slate-600"
          placeholder="Add a step"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
        />
        <Button type="button" onClick={addStep} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {formData.admissionProcess?.steps?.map((step: string, index: number) => (
          <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
            <span className="text-sm font-medium text-white">Step {index + 1}:</span>
            <span className="text-sm text-white">{step}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeStep(index)}
              className="h-4 w-4 p-0 ml-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function RequiredDocuments({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newDocument, setNewDocument] = useState('')

  const addDocument = () => {
    if (newDocument.trim()) {
      handleInputChange('documentsRequired', {
        ...formData.documentsRequired,
        title: formData.documentsRequired?.title || 'Documents Required',
        description: formData.documentsRequired?.description || '',
        documents: [...(formData.documentsRequired?.documents || []), newDocument.trim()]
      })
      setNewDocument('')
    }
  }

  const removeDocument = (index: number) => {
    handleInputChange('documentsRequired', {
      ...formData.documentsRequired,
      title: formData.documentsRequired?.title || 'Documents Required',
      description: formData.documentsRequired?.description || '',
      documents: formData.documentsRequired?.documents?.filter((_: string, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newDocument}
          onChange={(e) => setNewDocument(e.target.value)}
          className="bg-slate-700 border-slate-600"
          placeholder="Add a document"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
        />
        <Button type="button" onClick={addDocument} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.documentsRequired?.documents?.map((document: string, index: number) => (
          <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
            <span className="text-sm text-white">{document}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeDocument(index)}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeesStructureCourses({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newCourse, setNewCourse] = useState({ course_name: '', duration: '', annual_tuition_fee: '' })

  const addCourse = () => {
    if (newCourse.course_name.trim() && newCourse.duration.trim() && newCourse.annual_tuition_fee.trim()) {
      handleInputChange('feesStructure', {
        ...formData.feesStructure,
        title: formData.feesStructure?.title || 'Fees Structure',
        description: formData.feesStructure?.description || '',
        courses: [...(formData.feesStructure?.courses || []), { ...newCourse }]
      })
      setNewCourse({ course_name: '', duration: '', annual_tuition_fee: '' })
    }
  }

  const removeCourse = (index: number) => {
    handleInputChange('feesStructure', {
      ...formData.feesStructure,
      title: formData.feesStructure?.title || 'Fees Structure',
      description: formData.feesStructure?.description || '',
      courses: formData.feesStructure?.courses?.filter((_: any, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="space-y-2 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={newCourse.course_name}
            onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
            className="bg-slate-700 border-slate-600"
            placeholder="Course name"
          />
          <Input
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
            className="bg-slate-700 border-slate-600"
            placeholder="Duration (e.g., 4 years)"
          />
          <Input
            value={newCourse.annual_tuition_fee}
            onChange={(e) => setNewCourse({ ...newCourse, annual_tuition_fee: e.target.value })}
            className="bg-slate-700 border-slate-600"
            placeholder="Annual fee (e.g., $10,000)"
          />
        </div>
        <Button type="button" onClick={addCourse} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>
      <div className="space-y-2">
        {formData.feesStructure?.courses?.map((course: any, index: number) => (
          <div key={index} className="bg-slate-700 p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-white">{course.course_name}</h4>
                <p className="text-sm text-gray-300">Duration: {course.duration}</p>
                <p className="text-sm text-gray-300">Annual Tuition: {course.annual_tuition_fee}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCourse(index)}
                className="h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CampusHighlightsList({ formData, handleInputChange }: { formData: CollegeFormData, handleInputChange: Function }) {
  const [newHighlight, setNewHighlight] = useState('')

  const addHighlight = () => {
    if (newHighlight.trim()) {
      handleInputChange('campusHighlights', {
        ...formData.campusHighlights,
        title: formData.campusHighlights?.title || 'Campus Highlights',
        description: formData.campusHighlights?.description || '',
        highlights: [...(formData.campusHighlights?.highlights || []), newHighlight.trim()]
      })
      setNewHighlight('')
    }
  }

  const removeHighlight = (index: number) => {
    handleInputChange('campusHighlights', {
      ...formData.campusHighlights,
      title: formData.campusHighlights?.title || 'Campus Highlights',
      description: formData.campusHighlights?.description || '',
      highlights: formData.campusHighlights?.highlights?.filter((_: string, i: number) => i !== index) || []
    })
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={newHighlight}
          onChange={(e) => setNewHighlight(e.target.value)}
          className="bg-slate-700 border-slate-600"
          placeholder="Add a campus highlight"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
        />
        <Button type="button" onClick={addHighlight} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.campusHighlights?.highlights?.map((highlight: string, index: number) => (
          <div key={index} className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
            <span className="text-sm text-white">{highlight}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHighlight(index)}
              className="h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
