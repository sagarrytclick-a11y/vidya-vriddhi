'use client'

import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react'

const enquiriesData = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    category: 'Engineering',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 87654 32109',
    category: 'Medical',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 76543 21098',
    category: 'Management',
    createdAt: '2024-01-13'
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: null,
    category: 'Engineering',
    createdAt: '2024-01-12'
  }
]

export default function EnquiriesPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Enquiries Management</h1>
            <p className="text-gray-400 text-sm mt-1">Manage student enquiries and contacts</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search enquiries..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-blue-500"
            />
          </div>
          <select className="bg-slate-800 border-slate-700 text-white px-4 py-2 rounded-md focus:ring-blue-500">
            <option value="">All Categories</option>
            <option value="engineering">Engineering</option>
            <option value="medical">Medical</option>
            <option value="management">Management</option>
          </select>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiriesData.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-3 px-4 text-white font-medium">{enquiry.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{enquiry.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {enquiry.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{enquiry.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Not provided</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-600 text-gray-300">
                          {enquiry.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{enquiry.createdAt}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-slate-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-slate-700">
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
