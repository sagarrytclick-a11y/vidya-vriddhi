"use client"
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { useNewsContext } from '@/contexts/news-context'
import { useAdminNews, News, NewsFormData } from '@/hooks/useAdminNews'
import { Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react'
import { useCanDelete } from '@/contexts/admin-context'
import { Pagination } from '@/components/ui/pagination'

const AddNewsModal = dynamic(() => import('@/components/admin/news/add-news-modal').then(m => ({ default: m.AddNewsModal })))
const ViewNewsModal = dynamic(() => import('@/components/admin/news/view-news-modal').then(m => ({ default: m.ViewNewsModal })))
const EditNewsModal = dynamic(() => import('@/components/admin/news/edit-news-modal').then(m => ({ default: m.EditNewsModal })))
const DeleteNewsModal = dynamic(() => import('@/components/admin/news/delete-news-modal').then(m => ({ default: m.DeleteNewsModal })))

export default function NewsPage() {
  const { canDelete } = useCanDelete()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Use hook directly for data with pagination
  const {
    news,
    total,
    isLoading,
    error,
  } = useAdminNews(limit, (page - 1) * limit)
  
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

  const handleCreateNews = (data: NewsFormData) => {
    closeAddModal()
    void createNews(data)
  }

  const handleUpdateNews = (id: string, data: Partial<NewsFormData>) => {
    closeEditModal()
    void updateNews(id, data)
  }

  const handleDeleteNews = async (newsItem: any) => {
    openDeleteModal(newsItem)
  }

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (isLoading) {
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
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="News List"
          subtitle={total > 0 ? `${total} items` : undefined}
          action={
            <Button onClick={openAddModal} className={adminPageActionClass}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          }
        />

        <AdminSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search news..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>News List</CardTitle>
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
                                className="text-teal-400 hover:text-teal-300 hover:bg-slate-700"
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
                              {canDelete && (
<Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                onClick={() => handleDeleteNews(newsItem)}
                              >
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

                {/* Pagination */}
                {total > 0 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit)
                      setPage(1)
                    }}
                    hasNext={page < totalPages}
                    hasPrev={page > 1}
                  />
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
