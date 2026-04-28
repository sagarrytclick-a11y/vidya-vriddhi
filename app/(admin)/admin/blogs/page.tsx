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
import { useAdminBlogs } from '@/hooks/useAdminBlogs'
import { Blog, BlogFormData } from '@/contexts/blog-context'
import { Search, Plus, Trash2, Image as ImageIcon, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react'

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  
  // Use useAdminBlogs hook for pagination
  const { blogs, total, loading, error, createBlog, updateBlog, deleteBlog, refetchBlogs, isCreating, isUpdating } = useAdminBlogs(itemsPerPage, currentPage * itemsPerPage)
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

  const handleCreateBlog = async (data: BlogFormData) => {
    await createBlog(data)
    setIsAddModalOpen(false)
    refetchBlogs()
  }

  const handleUpdateBlog = async (id: string, data: Partial<BlogFormData>) => {
    await updateBlog(id, data)
    setIsEditModalOpen(false)
    refetchBlogs()
  }

  const handleDeleteBlog = async (blog: Blog) => {
    setSelectedBlog(blog)
    setIsDeleteModalOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(total / itemsPerPage)

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
            onClick={() => setIsAddModalOpen(true)}
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
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Blog List</CardTitle>
              {total > 0 && (
                <div className="text-sm text-gray-400">
                  Total: {total} items
                </div>
              )}
            </div>
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
