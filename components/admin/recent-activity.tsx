'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const recentActivities = [
  {
    action: 'New college added',
    item: 'MIT - Massachusetts Institute of Technology',
    time: '2 hours ago',
    type: 'college'
  },
  {
    action: 'Exam updated',
    item: 'JEE Main 2024 dates announced',
    time: '4 hours ago',
    type: 'exam'
  },
  {
    action: 'New enquiry received',
    item: 'John Doe - Engineering admission query',
    time: '6 hours ago',
    type: 'enquiry'
  },
  {
    action: 'Blog post published',
    item: 'Top 10 Engineering Colleges in 2024',
    time: '8 hours ago',
    type: 'blog'
  },
  {
    action: 'Country added',
    item: 'United Kingdom - Study destinations',
    time: '1 day ago',
    type: 'country'
  },
  {
    action: 'New course added',
    item: 'Computer Science Engineering',
    time: '2 days ago',
    type: 'course'
  },
  {
    action: 'News article published',
    item: 'New scholarship programs announced',
    time: '3 days ago',
    type: 'news'
  }
]

export function RecentActivity() {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white m-3">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{activity.action}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.item}</p>
              </div>
              <div className="text-xs text-slate-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
