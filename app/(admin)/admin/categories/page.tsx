"use client"
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddCategoryModal } from '@/components/admin/categories/add-category-modal'
import { ViewCategoryModal } from '@/components/admin/categories/view-category-modal'
import { EditCategoryModal } from '@/components/admin/categories/edit-category-modal'
import { DeleteCategoryModal } from '@/components/admin/categories/delete-category-modal'
import { LoadingTable } from '@/components/ui/loading'
import { Pagination } from '@/components/ui/pagination'
import { useCategoryContext, CategoryFormData } from '@/contexts/category-context'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react'

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    pagination,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    searchTerm,
    setSearchTerm,
    createCategory,
    deleteCategory,
    updateCategory,
    openAddModal,
    closeAddModal,
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    isAddModalOpen,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedCategory,
    isCreating,
    isUpdating
  } = useCategoryContext()

  const handleCreateCategory = async (data: CategoryFormData) => {
    await createCategory(data)
    closeAddModal()
  }

  const handleDeleteCategory = async (category: any) => {
    openDeleteModal(category)
  }

  const handleUpdateCategory = async (data: any) => {
    if (!selectedCategory) return
    try {
      await updateCategory({ id: selectedCategory.id, ...data })
      closeEditModal()
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1) // Reset to first page when changing limit
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Categories Management</h1>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={openAddModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingTable text="Loading categories..." />
            ) : error ? (
                <div className="text-center py-8 text-red-400">Error: {error || 'An error occurred'}</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? 'No categories found matching your search.' : 'No categories found. Create your first category!'}
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
                              <img
                                src={category.categoryImageUrl}
                                alt={category.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <div className={`w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center ${category.categoryImageUrl ? 'hidden' : ''}`}>
                              <ImageIcon className="h-5 w-5 text-slate-400" />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{category.name}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{category.slug}</td>
                          <td className="py-3 px-4 text-gray-300 text-sm max-w-xs truncate">
                            {category.description || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={category.active ? 'default' : 'secondary'}>
                              {category.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{formatDate(category.createdAt)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                onClick={() => openViewModal(category)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                                onClick={() => openEditModal(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                onClick={() => handleDeleteCategory(category)}
                              >
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
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  limit={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleCreateCategory}
          isSubmitting={isCreating}
        />

        <ViewCategoryModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          category={selectedCategory}
        />

        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          category={selectedCategory}
          onUpdate={handleUpdateCategory}
          isUpdating={isUpdating}
        />

        <DeleteCategoryModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          category={selectedCategory}
        />
      </div>
    </AdminLayout>
  )
}
