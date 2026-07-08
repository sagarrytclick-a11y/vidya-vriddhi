'use client'

import { AdminLayout } from '@/components/admin/layout'
import { StatsCards } from '@/components/admin/stats-cards'
import { RecentActivity } from '@/components/admin/recent-activity'
import { QuickActions } from '@/components/admin/quick-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, FileText, Calendar } from 'lucide-react'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 p-4">
        <RecentActivity />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Growth Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Visitors</span>
                <span className="text-green-400 font-semibold">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">New Enquiries</span>
                <span className="text-green-400 font-semibold">+8.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Course Enrollment</span>
                <span className="text-red-400 font-semibold">-2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-400" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">JEE Main Exam</p>
                  <p className="text-xs text-gray-400">April 6, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">NEET Counseling</p>
                  <p className="text-xs text-gray-400">April 15, 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">College Fair</p>
                  <p className="text-xs text-gray-400">April 20, 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
