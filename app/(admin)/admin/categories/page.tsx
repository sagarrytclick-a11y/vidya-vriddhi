"use client"

import { useState, useRef, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AdminPageHeader,
  AdminSearch,
  adminPagePadClass,
  adminPageActionClass,
  adminCardClass,
  adminCardTitleClass,
  AdminPageSkeleton,
  AdminTableSkeleton,
} from '@/components/admin/page-ui'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import NextImage from "next/image";
import { Plus, Trash2, ImageIcon, Eye, Edit, Upload, X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useAdminCategories, Category, CreateCategoryData, UpdateCategoryData } from '@/hooks/useAdminCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'
import {
  adminCheckboxClass,
  adminDialogClass,
  adminViewDialogClass,
  adminViewHeaderClass,
  adminViewBodyClass,
  adminFieldClass,
  adminCancelBtnClass,
  adminPrimaryBtnClass,
  adminDangerBtnClass,
  adminLabelClass,
} from '@/components/admin/modal-ui'
import { AdminImageDropzone } from '@/components/admin/image-dropzone'

// Add Category Modal
function AddCategoryModal({ isOpen, onClose, onSuccess, createCategory, isCreating }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void; createCategory: (data: CreateCategoryData) => Promise<Category>; isCreating: boolean }) {
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
    const payload = { ...formData }
    setFormData({ name: '', slug: '', description: '', categoryImageUrl: '', active: true })
    onClose()
    try {
      await createCategory(payload)
      onSuccess?.()
    } catch {
      // toast handled by hook
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminViewDialogClass, 'max-w-2xl')}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white">Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={cn(adminViewBodyClass, 'space-y-4')}>
            <div>
              <Label className={adminLabelClass}>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className={adminFieldClass} required />
            </div>
            <div>
              <Label className={adminLabelClass}>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className={adminFieldClass} required />
            </div>
            <div>
              <Label className={adminLabelClass}>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={adminFieldClass} rows={3} />
            </div>
            <div>
              <Label className={adminLabelClass}>Category Image</Label>
              <div className="space-y-3">
                <AdminImageDropzone
                  label="Upload image"
                  uploading={uploading}
                  compact
                  hint="PNG, JPG, GIF up to 5MB · drag & drop or browse"
                  onFiles={async (files) => {
                    if (files[0]) await handleImageUpload(files[0])
                  }}
                />

                {formData.categoryImageUrl && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] p-3">
                    <NextImage src={formData.categoryImageUrl} alt="Category" width={64} height={64} className="rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{formData.categoryImageUrl}</p>
                      <p className="text-xs text-[#6b7280]">Image uploaded</p>
                    </div>
                    <button type="button" onClick={removeImage} className="p-1 text-[#6b7280] transition-colors hover:text-rose-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-[#6b7280]">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <Input type="url" value={formData.categoryImageUrl} onChange={e => setFormData({ ...formData, categoryImageUrl: e.target.value })} className={adminFieldClass} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked as boolean })}
                className={adminCheckboxClass}
              />
              <Label className={adminLabelClass}>Active</Label>
            </div>
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-white/4 bg-[#0c0f14]/50 px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} className={adminCancelBtnClass}>Cancel</Button>
            <Button type="submit" disabled={isCreating} className={adminPrimaryBtnClass}>{isCreating ? 'Creating...' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit Category Modal with Image Upload
function EditCategoryModal({ isOpen, onClose, category, onSuccess, updateCategory, isUpdating }: { isOpen: boolean; onClose: () => void; category: Category | null; onSuccess?: () => void; updateCategory: (data: UpdateCategoryData) => Promise<Category>; isUpdating: boolean }) {
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
    const payload = { id: category.id, ...formData }
    onClose()
    try {
      await updateCategory(payload)
      onSuccess?.()
    } catch {
      // toast handled by hook
    }
  }

  if (!category) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(adminViewDialogClass, 'max-w-2xl')}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white">Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className={cn(adminViewBodyClass, 'space-y-4')}>
            <div>
              <Label className={adminLabelClass}>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={adminFieldClass} required />
            </div>
            <div>
              <Label className={adminLabelClass}>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className={adminFieldClass} required />
            </div>
            <div>
              <Label className={adminLabelClass}>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={adminFieldClass} rows={3} />
            </div>
            <div>
              <Label className={adminLabelClass}>Category Image</Label>
              <div className="space-y-3">
                <AdminImageDropzone
                  label="Upload image"
                  uploading={uploading}
                  compact
                  hint="PNG, JPG, GIF up to 5MB · drag & drop or browse"
                  onFiles={async (files) => {
                    if (files[0]) await handleImageUpload(files[0])
                  }}
                />

                {formData.categoryImageUrl && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#0c0f14] p-3">
                    <NextImage src={formData.categoryImageUrl} alt="Category" width={64} height={64} className="rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{formData.categoryImageUrl}</p>
                      <p className="text-xs text-[#6b7280]">Image uploaded</p>
                    </div>
                    <button type="button" onClick={removeImage} className="p-1 text-[#6b7280] transition-colors hover:text-rose-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-[#6b7280]">OR</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <Input type="url" value={formData.categoryImageUrl} onChange={e => setFormData({ ...formData, categoryImageUrl: e.target.value })} className={adminFieldClass} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked as boolean })}
                className={adminCheckboxClass}
              />
              <Label className={adminLabelClass}>Active</Label>
            </div>
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-white/4 bg-[#0c0f14]/50 px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose} className={adminCancelBtnClass}>Cancel</Button>
            <Button type="submit" disabled={isUpdating} className={adminPrimaryBtnClass}>{isUpdating ? 'Updating...' : 'Update'}</Button>
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
      <DialogContent className={cn(adminViewDialogClass, 'max-w-lg')}>
        <DialogHeader className={adminViewHeaderClass}>
          <DialogTitle className="text-white">Category Details</DialogTitle>
        </DialogHeader>
        <div className={cn(adminViewBodyClass, 'space-y-4')}>
          {category.categoryImageUrl && (
            <NextImage
              src={category.categoryImageUrl}
              alt={category.name}
              width={400}
              height={160}
              className="h-40 w-full rounded-xl object-cover ring-1 ring-white/6"
            />
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-[#6b7280]">Name</div>
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2 text-white">{category.name}</div>
            <div className="text-[#6b7280]">Slug</div>
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2 text-white">{category.slug}</div>
            <div className="text-[#6b7280]">Description</div>
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2 text-white">{category.description || '-'}</div>
            <div className="text-[#6b7280]">Status</div>
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2">
              <span className={`rounded-full px-2 py-0.5 text-xs ${category.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-[#9ca3af]'}`}>
                {category.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="text-[#6b7280]">Created</div>
            <div className="rounded-xl border border-white/6 bg-[#0c0f14] px-3 py-2 text-white">
              {new Date(category.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="shrink-0 border-t border-white/4 px-6 py-4">
          <Button onClick={onClose} className={cn(adminCancelBtnClass, 'w-full')}>Close</Button>
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
      <DialogContent className={cn(adminDialogClass, 'max-w-md')}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            Delete Category
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4">
            <p className="text-sm text-[#d1d5db]">
              Are you sure you want to delete <span className="font-medium text-white">&quot;{category.name}&quot;</span>? This cannot be undone.
            </p>
          </div>
          <div className="rounded-xl border border-white/6 bg-[#0c0f14] p-3 text-sm text-[#6b7280]">
            <strong className="text-white">Category:</strong> {category.name}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className={adminCancelBtnClass}>Cancel</Button>
            <Button onClick={onConfirm} disabled={loading} className={adminDangerBtnClass}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
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
  const debouncedSearch = useDebounce(search, 300)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const {
    categories,
    pagination,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAdminCategories(page, limit, debouncedSearch)

  const handleDelete = () => {
    if (!selectedCategory) return
    const id = selectedCategory.id
    setIsDeleteOpen(false)
    setSelectedCategory(null)
    void deleteCategory(id)
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="All Categories"
          action={
            <Button onClick={() => setIsAddOpen(true)} className={adminPageActionClass}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          }
        />

        <AdminSearch
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Search categories..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <AdminTableSkeleton rows={6} columns={5} />
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
                              <NextImage src={category.categoryImageUrl} alt={category.name} width={48} height={48} className="rounded-lg object-cover" />
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
                              <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
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

        <AddCategoryModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} createCategory={createCategory} isCreating={isCreating} />
        <ViewCategoryModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} category={selectedCategory} />
        <EditCategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} category={selectedCategory} updateCategory={updateCategory} isUpdating={isUpdating} />
        <DeleteCategoryModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} category={selectedCategory} onConfirm={handleDelete} loading={isDeleting} />
      </div>
    </AdminLayout>
  )
}
