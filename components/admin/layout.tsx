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
                    <div className="admin-panel flex h-screen overflow-hidden bg-[#080a0e] text-white">
                      <Sidebar />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Header />
                        <main className="admin-main flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(234,88,12,0.03),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.04),_transparent_40%)]">
                          {children}
                        </main>
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
