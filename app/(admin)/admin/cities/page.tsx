'use client'

import dynamic from 'next/dynamic'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCityContext } from '@/contexts/city-context'

const AddCityModal = dynamic(() => import('@/components/admin/cities/add-city-modal').then(m => ({ default: m.AddCityModal })))
const ViewCityModal = dynamic(() => import('@/components/admin/cities/view-city-modal').then(m => ({ default: m.ViewCityModal })))
const EditCityModal = dynamic(() => import('@/components/admin/cities/edit-city-modal').then(m => ({ default: m.EditCityModal })))
const DeleteCityModal = dynamic(() => import('@/components/admin/cities/delete-city-modal').then(m => ({ default: m.DeleteCityModal })))

export default function CitiesPage() {
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
  } = useCityContext()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingPage text="Loading cities..." />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
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

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Cities Management</h1>
          </div>
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search cities..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-teal-500"
          />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Cities ({pagination?.total || cities.length})</CardTitle>
          </CardHeader>
          <CardContent>
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
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => openDeleteModal(city)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} cities
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      pageNum === pagination.page
                        ? "bg-teal-600 hover:bg-teal-700 text-white"
                        : "border-slate-600 text-white hover:bg-slate-700"
                    }
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
