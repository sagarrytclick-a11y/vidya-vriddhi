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
import { useAdminBlogs } from '@/hooks/useAdminBlogs'
import { Blog, BlogFormData } from '@/contexts/blog-context'
import { Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react'
import { useCanDelete } from '@/contexts/admin-context'
import { Pagination } from '@/components/ui/pagination'

const AddBlogModal = dynamic(() => import('@/components/admin/blogs/add-blog-modal').then(m => ({ default: m.AddBlogModal })))
const ViewBlogModal = dynamic(() => import('@/components/admin/blogs/view-blog-modal').then(m => ({ default: m.ViewBlogModal })))
const EditBlogModal = dynamic(() => import('@/components/admin/blogs/edit-blog-modal').then(m => ({ default: m.EditBlogModal })))
const DeleteBlogModal = dynamic(() => import('@/components/admin/blogs/delete-blog-modal').then(m => ({ default: m.DeleteBlogModal })))

export default function BlogsPage() {
  const { canDelete } = useCanDelete()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Use useAdminBlogs hook for pagination
  const { blogs, total, loading, error, createBlog, updateBlog, deleteBlog, isCreating, isUpdating } =
    useAdminBlogs(limit, (page - 1) * limit)
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  const handleCreateBlog = (data: BlogFormData) => {
    setIsAddModalOpen(false)
    void createBlog(data)
  }

  const handleUpdateBlog = (id: string, data: Partial<BlogFormData>) => {
    setIsEditModalOpen(false)
    void updateBlog(id, data)
  }

  const handleDeleteBlog = async (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (loading) {
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
          title="Blog List"
          subtitle={total > 0 ? `${total} items` : undefined}
          action={
            <Button onClick={() => setIsAddModalOpen(true)} className={adminPageActionClass}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blog
            </Button>
          }
        />

        <AdminSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search blogs..."
        />

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className={adminCardTitleClass}>Blog List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No blogs found matching your search.' : 'No blogs found. Create your first blog!'}
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
                      {filteredBlogs.map((blog) => (
                        <tr key={blog.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{blog.title}</p>
                              <p className="text-gray-400 text-sm truncate max-w-xs">
                                {blog.content.substring(0, 100)}...
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-300 text-sm">{blog.slug}</p>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={blog.active ? "default" : "secondary"}>
                              {blog.active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-gray-300 text-sm">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-3 px-4">
                            {blog.imageUrl ? (
                              <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-slate-600">
                                  <NextImage
                                    src={blog.imageUrl}
                                    alt={blog.title}
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
                                onClick={() => {
                                  setSelectedBlog(blog)
                                  setIsViewModalOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                                onClick={() => {
                                  setSelectedBlog(blog)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {canDelete && (
<Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                                onClick={() => handleDeleteBlog(blog)}
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

        <AddBlogModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <ViewBlogModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedBlog(null)
          }}
          blog={selectedBlog}
        />

        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedBlog(null)
          }}
          blog={selectedBlog}
        />

        <DeleteBlogModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setSelectedBlog(null)
          }}
          blog={selectedBlog}
        />
      </div>
    </AdminLayout>
  )
}
