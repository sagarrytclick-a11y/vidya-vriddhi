"use client"
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddBlogModal } from '@/components/admin/blogs/add-blog-modal'
import { ViewBlogModal } from '@/components/admin/blogs/view-blog-modal'
import { EditBlogModal } from '@/components/admin/blogs/edit-blog-modal'
import { DeleteBlogModal } from '@/components/admin/blogs/delete-blog-modal'
import { LoadingPage, LoadingTable } from '@/components/ui/loading'
import { useBlogContext } from '@/contexts/blog-context'
import { Blog, BlogFormData } from '@/contexts/blog-context'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit } from 'lucide-react'

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const {
    blogs,
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
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
    selectedBlog,
    isCreating,
    isUpdating
  } = useBlogContext()

  const handleCreateBlog = async (data: BlogFormData) => {
    await createBlog(data)
    closeAddModal()
  }

  const handleUpdateBlog = async (id: string, data: Partial<BlogFormData>) => {
    await updateBlog(id, data)
    closeEditModal()
  }

  const handleDeleteBlog = async (blog: Blog) => {
    openDeleteModal(blog)
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <LoadingPage text="Loading blogs..." />
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
          <h1 className="text-3xl font-bold text-white">Blogs</h1>
          <Button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Blog
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Blog List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {searchTerm ? 'No blogs found matching your search.' : 'No blogs found. Create your first blog!'}
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
                              <div className="w-8 h-8 bg-slate-600 rounded overflow-hidden shrink-0">
                                <img
                                  src={blog.imageUrl}
                                  alt={blog.title}
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
                              onClick={() => openViewModal(blog)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-400 hover:text-green-300 hover:bg-slate-700"
                              onClick={() => openEditModal(blog)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                              onClick={() => handleDeleteBlog(blog)}
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

        <AddBlogModal
          isOpen={isAddModalOpen}
          onClose={closeAddModal}
        />

        <ViewBlogModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          blog={selectedBlog}
        />

        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          blog={selectedBlog}
        />

        <DeleteBlogModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          blog={selectedBlog}
        />
      </div>
    </AdminLayout>
  )
}
