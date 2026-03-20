'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { AddCollegeModal } from './add-college-modal'
import { ViewCollegeModal } from './view-college-modal'
import { useColleges } from '@/hook/useColleges'
import { useCountries } from '@/hook/useCountries'
import { useCities } from '@/hook/useCities'
import { Plus, Search, Edit, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { College, CollegeFormData } from '@/types/college'

export function CollegeList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { colleges, isLoading, error, createCollege, updateCollege, deleteCollege } = useColleges()
  const { countries } = useCountries()
  const { cities } = useCities()

  const filteredColleges = colleges
    .filter(college =>
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const handleAddCollege = async (data: CollegeFormData) => {
    try {
      await createCollege(data)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to create college:', error)
    }
  }

  const handleEditCollege = async (data: CollegeFormData) => {
    if (!selectedCollege) return
    try {
      await updateCollege(selectedCollege.id, data)
      setIsViewModalOpen(false)
      setSelectedCollege(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update college:', error)
    }
  }

  const handleDeleteCollege = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await deleteCollege(id)
        setIsViewModalOpen(false)
        setSelectedCollege(null)
      } catch (error) {
        console.error('Failed to delete college:', error)
      }
    }
  }

  const openViewModal = (college: any) => {
    setSelectedCollege(college)
    setIsViewModalOpen(true)
    setIsEditing(false)
  }

  const openEditModal = (college: any) => {
    setSelectedCollege(college)
    setIsViewModalOpen(true)
    setIsEditing(true)
  }

  if (isLoading && colleges.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-gray-400">Loading colleges...</div>
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
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
          <CardTitle className="text-white">All Colleges ({filteredColleges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredColleges.length === 0 ? (
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
                  {filteredColleges.map((college) => (
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
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700" onClick={() => openEditModal(college)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700" onClick={() => handleDeleteCollege(college.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Add College Modal */}
      <AddCollegeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCollege}
        countries={countries}
        cities={cities}
      />

      {/* View/Edit College Modal */}
      <ViewCollegeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedCollege(null)
          setIsEditing(false)
        }}
        college={selectedCollege}
        onEdit={isEditing ? undefined : (college) => openEditModal(college)}
        onDelete={isEditing ? undefined : handleDeleteCollege}
      />

      {/* Edit College Modal (shown when editing) */}
      {isEditing && selectedCollege && (
        <AddCollegeModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedCollege(null)
            setIsEditing(false)
          }}
          onSubmit={handleEditCollege}
          initialData={selectedCollege}
          isEdit={true}
          countries={countries}
          cities={cities}
        />
      )}
    </div>
  )
}
