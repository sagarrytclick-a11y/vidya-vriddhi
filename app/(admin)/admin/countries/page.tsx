'use client'

import dynamic from 'next/dynamic'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useCountryContext } from '@/contexts/country-context'

const AddCountryModal = dynamic(() => import('@/components/admin/countries/add-country-modal').then(m => ({ default: m.AddCountryModal })))
const ViewCountryModal = dynamic(() => import('@/components/admin/countries/view-country-modal').then(m => ({ default: m.ViewCountryModal })))
const EditCountryModal = dynamic(() => import('@/components/admin/countries/edit-country-modal').then(m => ({ default: m.EditCountryModal })))
const DeleteCountryModal = dynamic(() => import('@/components/admin/countries/delete-country-modal').then(m => ({ default: m.DeleteCountryModal })))

export default function CountriesPage() {
  const {
    countries,
    isLoading,
    error,
    createCountry,
    updateCountry,
    deleteCountry,
    isCreating,
    isUpdating,
    isDeleting,
    selectedCountry,
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
  } = useCountryContext()

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingPage text="Loading countries..." />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-400">Error: {error.message}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <AddCountryModal 
        isOpen={isAddModalOpen} 
        onClose={closeAddModal} 
        createCountry={createCountry}
        isCreating={isCreating}
      />
      <ViewCountryModal isOpen={isViewModalOpen} onClose={closeViewModal} country={selectedCountry} />
      <EditCountryModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal} 
        country={selectedCountry} 
        updateCountry={updateCountry}
        isUpdating={isUpdating}
      />
      <DeleteCountryModal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal} 
        country={selectedCountry} 
        deleteCountry={deleteCountry}
        isDeleting={isDeleting}
      />
      
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Countries Management</h1>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Country
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search countries..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
          />
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Countries ({countries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Country Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Slug</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Flag</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country) => (
                    <tr key={country.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white">{country.name}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{country.slug}</td>
                      <td className="py-3 px-4 text-white">{country.flagEmoji || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          country.active 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {country.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(country.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700" onClick={() => openViewModal(country)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={() => openEditModal(country)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => openDeleteModal(country)}>
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
      </div>
    </AdminLayout>
  )
}
