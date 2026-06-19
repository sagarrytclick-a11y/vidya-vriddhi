'use client'

import { useState } from 'react'
import { Plus, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCollegeModal } from './add-college-modal'
import { ViewCollegeModal } from './view-college-modal'
import { DeleteCollegeModal } from './delete-college-modal'
import { useCollegeContext } from '@/contexts/college-context'
import { useCountryContext } from '@/contexts/country-context'
import { useCityContext } from '@/contexts/city-context'
import { TableSkeleton } from '@/components/ui/skeletons'
import { College, CollegeFormData } from '@/types/college'

export function CollegeList() {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    colleges,
    isLoading,
    error,
    createCollege,
    updateCollege,
    deleteCollege,
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
    selectedCollege,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
    page,
    setPage,
  } = useCollegeContext()
  
  const { countries } = useCountryContext()
  const { cities } = useCityContext()

  const filteredColleges = colleges
    .filter((college: College) =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: College, b: College) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const handleAddCollege = async (data: CollegeFormData) => {
    try {
      await createCollege(data)
      closeAddModal()
    } catch (error) {
      console.error('Failed to create college:', error)
    }
  }

  const handleEditCollege = async (data: CollegeFormData) => {
    if (!selectedCollege) return
    try {
      await updateCollege(selectedCollege.id, data)
      closeViewModal()
    } catch (error) {
      console.error('Failed to update college:', error)
    }
  }

  const handleDeleteCollege = async (college: College) => {
    openDeleteModal(college)
  }

  if (isLoading && colleges.length === 0) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <TableSkeleton rows={6} columns={6} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Colleges Management</h1>
        </div>
        <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add College
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search colleges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
        />
      </div>

      {error && (
        <Card className="border-red-900 bg-red-900/20 mb-6">
          <CardContent className="pt-6">
            <p className="text-red-400">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Colleges ({pagination?.total || colleges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {colleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {searchTerm ? 'No colleges found matching your search.' : 'No colleges found. Create your first college!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">College Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Features</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map((college) => (
                    <tr key={college.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{college.name}</p>
                          <p className="text-gray-400 text-sm">/{college.slug}</p>
                          {college.description && (
                            <p className="text-gray-400 text-sm truncate max-w-xs mt-1">
                              {college.description.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {college.city?.name}, {college.country?.name}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {college.features && college.features.length > 0
                          ? college.features.slice(0, 2).join(', ') + (college.features.length > 2 ? '...' : '')
                          : 'No features'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          college.active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {college.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(college.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700" onClick={() => openViewModal(college)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={async () => await openEditModal(college)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => handleDeleteCollege(college)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                  <div className="text-sm text-gray-400">
                    Showing {((page - 1) * pagination.limit) + 1} - {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} colleges
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrev}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 p-0 ${
                            pageNum === page
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                          }`}
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add College Modal */}
      <AddCollegeModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddCollege}
        isSubmitting={isCreating}
        countries={countries}
        cities={cities}
      />

      {/* View College Modal */}
      <ViewCollegeModal
        isOpen={isViewModalOpen && !isEditModalOpen}
        onClose={() => {
          closeViewModal()
        }}
        college={selectedCollege}
        onEdit={(college) => openEditModal(college)}
        onDelete={(college) => openDeleteModal(college)}
      />

      {/* Delete College Modal */}
      <DeleteCollegeModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        college={selectedCollege}
        onDelete={async (id: string) => {
          try {
            await deleteCollege(id)
            closeDeleteModal()
          } catch (error) {
            console.error('Failed to delete college:', error)
          }
        }}
        isDeleting={isDeleting}
      />

      {/* Edit College Modal */}
      {isEditModalOpen && selectedCollege && (
        <AddCollegeModal
          isOpen={true}
          onClose={() => {
            closeEditModal()
          }}
          onSubmit={handleEditCollege}
          initialData={selectedCollege}
          isEdit={true}
          isSubmitting={isUpdating}
          countries={countries}
          cities={cities}
        />
      )}
    </div>
  )
}
