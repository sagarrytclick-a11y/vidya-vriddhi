'use client'

import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddCollegeModal } from './add-college-modal'
import { ViewCollegeModal } from './view-college-modal'
import { DeleteCollegeModal } from './delete-college-modal'
import { useCollegeContext } from '@/contexts/college-context'
import { useCountryContext } from '@/contexts/country-context'
import { useCityContext } from '@/contexts/city-context'
import { Pagination } from '@/components/ui/pagination'
import { useCanDelete } from '@/contexts/admin-context'

import { College, CollegeFormData } from '@/types/college'
import {
  AdminPageHeader,
  AdminSearch,
  adminPagePadClass,
  adminPageActionClass,
  adminCardClass,
  adminCardTitleClass,
  AdminTableSkeleton,
} from '@/components/admin/page-ui'

export function CollegeList() {
  const { canDelete } = useCanDelete()
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
    limit,
    setLimit,
    search,
    setSearch,
  } = useCollegeContext()
  
  const { countries } = useCountryContext()
  const { cities } = useCityContext()

  const handleAddCollege = (data: CollegeFormData) => {
    closeAddModal()
    void createCollege(data).catch((error) => {
      console.error('Failed to create college:', error)
    })
  }

  const handleEditCollege = (data: CollegeFormData) => {
    if (!selectedCollege) return
    const id = selectedCollege.id
    closeEditModal()
    closeViewModal()
    void updateCollege(id, data)
  }

  const handleDeleteCollege = async (college: College) => {
    openDeleteModal(college)
  }

  if (isLoading && colleges.length === 0) {
    return (
      <div className={adminPagePadClass}>
        <div className="rounded-2xl border border-white/5 bg-[#12161e] p-4 ring-1 ring-white/5">
          <AdminTableSkeleton rows={6} columns={6} />
        </div>
      </div>
    )
  }

  return (
    <div className={adminPagePadClass}>
      <AdminPageHeader
        title="All Colleges"
        subtitle={`${pagination?.total || colleges.length} institutions in catalog`}
        action={
          <Button onClick={openAddModal} className={adminPageActionClass}>
            <Plus className="w-4 h-4 mr-2" />
            Add College
          </Button>
        }
      />

      <AdminSearch
        value={search}
        onChange={setSearch}
        placeholder="Search colleges..."
      />

      {error && (
        <Card className="border-rose-500/20 bg-rose-500/10 mb-6">
          <CardContent className="pt-6">
            <p className="text-rose-300">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      <Card className={adminCardClass}>
        <CardHeader className="border-b border-white/4">
          <CardTitle className={adminCardTitleClass}>College List ({pagination?.total || colleges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {colleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">
                {search ? 'No colleges found matching your search.' : 'No colleges found. Create your first college!'}
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
                          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-slate-700" onClick={async () => await openEditModal(college)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {canDelete && (
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => handleDeleteCollege(college)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit)
                    setPage(1)
                  }}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
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
        onDelete={canDelete ? (college) => openDeleteModal(college) : undefined}
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
