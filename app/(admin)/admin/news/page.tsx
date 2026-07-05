"use client"
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingPage, LoadingTable } from '@/components/ui/loading'
import { useNewsContext } from '@/contexts/news-context'
import { useAdminNews, News, NewsFormData } from '@/hooks/useAdminNews'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react'

const AddNewsModal = dynamic(() => import('@/components/admin/news/add-news-modal').then(m => ({ default: m.AddNewsModal })))
const ViewNewsModal = dynamic(() => import('@/components/admin/news/view-news-modal').then(m => ({ default: m.ViewNewsModal })))
const EditNewsModal = dynamic(() => import('@/components/admin/news/edit-news-modal').then(m => ({ default: m.EditNewsModal })))
const DeleteNewsModal = dynamic(() => import('@/components/admin/news/delete-news-modal').then(m => ({ default: m.DeleteNewsModal })))

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  
  // Use hook directly for data with pagination
  const {
    news,
    total,
    isLoading,
    error,
    refetchNews
  } = useAdminNews(itemsPerPage, currentPage * itemsPerPage)
  
  // Use context for modals and mutations
  const {
    createNews,
    updateNews,
    deleteNews,
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
    selectedNews,
    isCreating,
    isUpdating
  } = useNewsContext()

  const handleCreateNews = async (data: NewsFormData) => {
    await createNews(data)
    closeAddModal()
    refetchNews()
  }

  const handleUpdateNews = async (id: string, data: Partial<NewsFormData>) => {
    await updateNews(id, data)
    closeEditModal()
    refetchNews()
  }

  const handleDeleteNews = async (newsItem: any) => {
    openDeleteModal(newsItem)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(total / itemsPerPage)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingPage text="Loading news..." />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">News</h1>
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add News
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">News List</CardTitle>
              {total > 0 && (
                <div className="text-sm text-gray-400">
                  Total: {total} items
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredNews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No news found matching your search.' : 'No news found. Create your first news article!'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Slug</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Image</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNews.map((newsItem) => (
                        <tr key={newsItem.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{newsItem.title}</p>
                              <p className="text-gray-400 text-sm truncate max-w-xs">
                                {newsItem.content.substring(0, 100)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-300 text-sm">{newsItem.slug}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={newsItem.active ? "default" : "secondary"}>
                              {newsItem.active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-300 text-sm">
                              {new Date(newsItem.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            {newsItem.imageUrl ? (
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-slate-600">
                                  <NextImage
                                    src={newsItem.imageUrl}
                                    alt={newsItem.title}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                  />
                                  <div className="hidden h-full w-full items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-slate-400" />
                                  </div>
                                </div>
                                <span className="text-green-400 text-xs">✓</span>
                              </div>
                            ) : (
                              <ImageIcon className="h-4 w-4 text-slate-400" />
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                                onClick={() => openViewModal(newsItem)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                                onClick={() => openEditModal(newsItem)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                onClick={() => handleDeleteNews(newsItem)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                    <div className="text-sm text-gray-400">
                      Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, total)} of {total}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i
                        } else if (currentPage < 3) {
                          pageNum = i
                        } else if (currentPage > totalPages - 3) {
                          pageNum = totalPages - 5 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={currentPage === pageNum 
                              ? "bg-blue-600 hover:bg-blue-700 text-white" 
                              : "border-slate-600 text-gray-300 hover:bg-slate-700"
                            }
                          >
                            {pageNum + 1}
                          </Button>
                        )
                      })}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <AddNewsModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
          onSubmit={handleCreateNews}
        />

        <ViewNewsModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          news={selectedNews}
        />

        <EditNewsModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          news={selectedNews}
          onUpdate={handleUpdateNews}
          isUpdating={isUpdating}
        />

        <DeleteNewsModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          news={selectedNews}
        />
      </div>
    </AdminLayout>
  )
}
