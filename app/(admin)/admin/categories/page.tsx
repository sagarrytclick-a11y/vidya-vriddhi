"use client"

import { useState, useRef, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingTable } from '@/components/ui/loading'
import { Pagination } from '@/components/ui/pagination'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useAdminCategories, Category, CreateCategoryData, UpdateCategoryData } from '@/hooks/useAdminCategories'

// Add Category Modal
function AddCategoryModal({ isOpen, onClose, onSuccess, createCategory, isCreating }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; createCategory: (data: CreateCategoryData) => Promise<Category>; isCreating: boolean }) {
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', categoryImageUrl: '', active: true })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setFormData(prev => ({ ...prev, categoryImageUrl: data.url }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, categoryImageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.slug) return
    try {
      await createCategory(formData)
      onSuccess()
      onClose()
      setFormData({ name: '', slug: '', description: '', categoryImageUrl: '', active: true })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="bg-slate-700 border-slate-600" required />
            </div>
            <div className="col-span-2">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-slate-700 border-slate-600" required />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-slate-700 border-slate-600" rows={3} />
            </div>
            <div className="col-span-2">
              <Label>Category Image</Label>
              <div className="space-y-3">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="addCategoryImageUpload" />
                  <label htmlFor="addCategoryImageUpload" className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors">
                    {uploading ? (
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-300">Click to upload image</span>
                        <span className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Preview */}
                {formData.categoryImageUrl && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <img src={formData.categoryImageUrl} alt="Category" className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{formData.categoryImageUrl}</p>
                        <p className="text-xs text-slate-400">Image uploaded</p>
                      </div>
                      <button type="button" onClick={removeImage} className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Or enter URL manually */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                </div>
                <Input type="url" value={formData.categoryImageUrl} onChange={e => setFormData({ ...formData, categoryImageUrl: e.target.value })} className="bg-slate-700 border-slate-600" placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked as boolean })} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit Category Modal with Image Upload
function EditCategoryModal({ isOpen, onClose, category, onSuccess, updateCategory, isUpdating }: { isOpen: boolean; onClose: () => void; category: Category | null; onSuccess: () => void; updateCategory: (data: UpdateCategoryData) => Promise<Category>; isUpdating: boolean }) {
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', categoryImageUrl: '', active: true })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        categoryImageUrl: category.categoryImageUrl || '',
        active: category.active
      })
    }
  }, [category])

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setFormData(prev => ({ ...prev, categoryImageUrl: data.url }))
      toast.success('Image uploaded!')
    } catch (err) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, categoryImageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return
    try {
      await updateCategory({ id: category.id, ...formData })
      onSuccess()
      onClose()
    } catch (err) {
      // Error is handled by the hook
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-slate-700 border-slate-600" required />
            </div>
            <div className="col-span-2">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="bg-slate-700 border-slate-600" required />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-slate-700 border-slate-600" rows={3} />
            </div>
            <div className="col-span-2">
              <Label>Category Image</Label>
              <div className="space-y-3">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="categoryImageUpload" />
                  <label htmlFor="categoryImageUpload" className="flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/50 transition-colors">
                    {uploading ? (
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="animate-spin h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-300">Click to upload image</span>
                        <span className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image Preview */}
                {formData.categoryImageUrl && (
                  <div className="relative group">
                    <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                      <img src={formData.categoryImageUrl} alt="Category" className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{formData.categoryImageUrl}</p>
                        <p className="text-xs text-slate-400">Image uploaded</p>
                      </div>
                      <button type="button" onClick={removeImage} className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Or enter URL manually */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                </div>
                <Input type="url" value={formData.categoryImageUrl} onChange={e => setFormData({ ...formData, categoryImageUrl: e.target.value })} className="bg-slate-700 border-slate-600" placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked as boolean })} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// View Modal
function ViewCategoryModal({ isOpen, onClose, category }: { isOpen: boolean; onClose: () => void; category: Category | null }) {
  if (!category) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader><DialogTitle>Category Details</DialogTitle></DialogHeader>
        <div className="space-y-3">
          {category.categoryImageUrl && <img src={category.categoryImageUrl} alt={category.name} className="w-full h-40 object-cover rounded" />}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-slate-400">Name:</div><div className="text-white">{category.name}</div>
            <div className="text-slate-400">Slug:</div><div className="text-white">{category.slug}</div>
            <div className="text-slate-400">Description:</div><div className="text-white">{category.description || '-'}</div>
            <div className="text-slate-400">Status:</div><div><Badge variant={category.active ? 'default' : 'secondary'}>{category.active ? 'Active' : 'Inactive'}</Badge></div>
            <div className="text-slate-400">Created:</div><div className="text-white">{new Date(category.createdAt).toLocaleDateString()}</div>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Delete Modal
function DeleteCategoryModal({ isOpen, onClose, category, onConfirm, loading }: { isOpen: boolean; onClose: () => void; category: Category | null; onConfirm: () => void; loading: boolean }) {
  if (!category) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader><DialogTitle>Delete Category</DialogTitle></DialogHeader>
        <p className="text-slate-300">Are you sure you want to delete &quot;{category.name}&quot;? This cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Page
export default function CategoriesPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { categories, pagination, isLoading, refetch } = useAdminCategories(page, limit, search)

  console.log('📋 [Page] Categories data:', { categories, categoriesLength: categories.length, pagination, isLoading, page, limit, search })

  const handleDelete = async () => {
    if (!selectedCategory) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
      toast.success('Category deleted')
      setIsDeleteOpen(false)
      refetch()
    } catch (err) {
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateCategory = async (data: CreateCategoryData): Promise<Category> => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to create')
      toast.success('Category created!')
      refetch()
      return result
    } catch (err) {
      toast.error('Failed to create category')
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateCategory = async (data: UpdateCategoryData): Promise<Category> => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/categories/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to update')
      toast.success('Category updated!')
      refetch()
      return result
    } catch (err) {
      toast.error('Failed to update category')
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Categories Management</h1>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingTable text="Loading categories..." />
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {search ? 'No categories found matching your search.' : 'No categories found. Create your first category!'}
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Image</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Slug</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Description</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-3 px-4">
                            {category.categoryImageUrl ? (
                              <img src={category.categoryImageUrl} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{category.name}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{category.slug}</td>
                          <td className="py-3 px-4 text-gray-300 text-sm max-w-xs truncate">{category.description || '-'}</td>
                          <td className="py-3 px-4">
                            <Badge variant={category.active ? 'default' : 'secondary'}>
                              {category.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(category.createdAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                onClick={() => { setSelectedCategory(category); setIsViewOpen(true); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                                onClick={() => { setSelectedCategory(category); setIsEditOpen(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                onClick={() => { setSelectedCategory(category); setIsDeleteOpen(true); }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <AddCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={refetch} createCategory={handleCreateCategory} isCreating={isCreating} />
        <ViewCategoryModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} category={selectedCategory} />
        <EditCategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} category={selectedCategory} onSuccess={refetch} updateCategory={handleUpdateCategory} isUpdating={isUpdating} />
        <DeleteCategoryModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} category={selectedCategory} onConfirm={handleDelete} loading={isDeleting} />
      </div>
    </AdminLayout>
  )
}
