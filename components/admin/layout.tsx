'use client'

import { Sidebar } from '@/components/admin/sidebar'
import { Header } from '@/components/admin/header'
import { AdminProvider } from '@/contexts/admin-context'
import { BlogProvider } from '@/contexts/blog-context'
import { CityProvider } from '@/contexts/city-context'
import { CountryProvider } from '@/contexts/country-context'
import { CollegeProvider } from '@/contexts/college-context'
import { CourseProvider } from '@/contexts/course-context'
import { ExamProvider } from '@/contexts/exam-context'
import { NewsProvider } from '@/contexts/news-context'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <BlogProvider>
        <CityProvider>
          <CountryProvider>
            <CollegeProvider>
              <CourseProvider>
                <ExamProvider>
                  <NewsProvider>
                    <div className="flex h-screen bg-slate-950">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 overflow-y-auto">{children}</main>
                      </div>
                    </div>
                  </NewsProvider>
                </ExamProvider>
              </CourseProvider>
            </CollegeProvider>
          </CountryProvider>
        </CityProvider>
      </BlogProvider>
    </AdminProvider>
  )
}
