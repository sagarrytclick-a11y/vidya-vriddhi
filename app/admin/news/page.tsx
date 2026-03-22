"use client"
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddNewsModal, NewsFormData } from '@/components/admin/news/add-news-modal'
import { ViewNewsModal } from '@/components/admin/news/view-news-modal'
import { EditNewsModal } from '@/components/admin/news/edit-news-modal'
import { DeleteNewsModal } from '@/components/admin/news/delete-news-modal'
import { LoadingPage, LoadingTable } from '@/components/ui/loading'
import { useNewsContext } from '@/contexts/news-context'
import { News } from '@/hook/useNews'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react'

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const {
    news,
    isLoading,
    error,
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
  }

  const handleUpdateNews = async (id: string, data: Partial<NewsFormData>) => {
    await updateNews(id, data)
    closeEditModal()
  }

  const handleDeleteNews = async (id: string) => {
    await deleteNews(id)
    closeDeleteModal()
  }

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <CardTitle className="text-white">News List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No news found matching your search.' : 'No news found. Create your first news article!'}
                </p>
              </div>
            ) : (
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
                              <div className="w-8 h-8 bg-slate-600 rounded overflow-hidden shrink-0">
                                <img
                                  src={newsItem.imageUrl}
                                  alt={newsItem.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                                <div className="hidden w-full h-full flex items-center justify-center">
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
                              onClick={() => handleDeleteNews(newsItem.id)}
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
