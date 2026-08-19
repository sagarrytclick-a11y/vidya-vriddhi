'use client'

import dynamic from 'next/dynamic'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useCanDelete } from '@/contexts/admin-context'
import { useCityContext } from '@/contexts/city-context'
import { Pagination } from '@/components/ui/pagination'

const AddCityModal = dynamic(() => import('@/components/admin/cities/add-city-modal').then(m => ({ default: m.AddCityModal })))
const ViewCityModal = dynamic(() => import('@/components/admin/cities/view-city-modal').then(m => ({ default: m.ViewCityModal })))
const EditCityModal = dynamic(() => import('@/components/admin/cities/edit-city-modal').then(m => ({ default: m.EditCityModal })))
const DeleteCityModal = dynamic(() => import('@/components/admin/cities/delete-city-modal').then(m => ({ default: m.DeleteCityModal })))

export default function CitiesPage() {
  const { canDelete } = useCanDelete()
  const {
    cities,
    pagination,
    isLoading,
    error,
    selectedCity,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isAddModalOpen,
    openViewModal,
    closeViewModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openAddModal,
    closeAddModal,
    setPage,
    setLimit,
    setSearch,
    search,
  } = useCityContext()

  if (isLoading && cities.length === 0 && !search) {
    return (
      <AdminLayout>
        <AdminPageSkeleton rows={6} columns={6} />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={adminPagePadClass}>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
      />
      <ViewCityModal isOpen={isViewModalOpen} onClose={closeViewModal} city={selectedCity} />
      <EditCityModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        city={selectedCity}
      />
      <DeleteCityModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        city={selectedCity}
      />

      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="All Cities"
          subtitle={`${pagination?.total || cities.length} cities`}
          action={
            <Button onClick={openAddModal} className={adminPageActionClass}>
              <Plus className="mr-2 h-4 w-4" />
              Add City
            </Button>
          }
        />

        <AdminSearch
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Search cities..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>
              All Cities ({pagination?.total || cities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cities.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                {search.trim()
                  ? 'No cities found matching your search.'
                  : 'No cities found. Create your first city!'}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">City Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Country</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Features</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white">{city.name || 'No name'}</td>
                      <td className="py-3 px-4 text-white">
                        {city.country?.flagEmoji} {city.country?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {city.features.length > 0 ? city.features.slice(0, 2).join(', ') + (city.features.length > 2 ? '...' : '') : 'No features'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${city.active
                            ? 'bg-green-900 text-green-300'
                            : 'bg-gray-700 text-gray-300'
                          }`}>
                          {city.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(city.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700" onClick={() => openViewModal(city)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-slate-700" onClick={() => openEditModal(city)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {canDelete && (
<Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => openDeleteModal(city)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/5">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit)
                setPage(1)
              }}
              hasNext={pagination.page < pagination.totalPages}
              hasPrev={pagination.page > 1}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
