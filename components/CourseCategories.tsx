'use client'

import { GraduationCap, BookOpen, Calculator, Building2, Briefcase, Globe, Laptop, Users } from 'lucide-react'

interface CourseCategory {
  id: number
  name: string
  courseCount: string
  icon: React.ReactNode
}

interface CourseCategoriesProps {
  categories?: CourseCategory[]
}

export default function CourseCategories({ categories: propCategories }: CourseCategoriesProps) {
  const defaultCategories: CourseCategory[] = [
    {
      id: 1,
      name: 'Online B.Com',
      courseCount: '22+ courses',
      icon: <Calculator className="w-8 h-8" />
    },
    {
      id: 2,
      name: 'Online BA',
      courseCount: '16+ courses',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 3,
      name: 'Online BCA',
      courseCount: '18+ courses',
      icon: <Laptop className="w-8 h-8" />
    },
    {
      id: 4,
      name: 'Online BBA',
      courseCount: '38+ courses',
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      id: 5,
      name: 'Online MA',
      courseCount: '17+ courses',
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 6,
      name: 'Online M.Com',
      courseCount: '7+ courses',
      icon: <Building2 className="w-8 h-8" />
    },
    {
      id: 7,
      name: 'Online M.Sc',
      courseCount: '14+ courses',
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      id: 8,
      name: 'Online M.Tech',
      courseCount: '29+ courses',
      icon: <Laptop className="w-8 h-8" />
    },
    {
      id: 9,
      name: 'Online MBA',
      courseCount: '65+ courses',
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      id: 10,
      name: 'Online MCA',
      courseCount: '19+ courses',
      icon: <Laptop className="w-8 h-8" />
    },
    {
      id: 11,
      name: 'Online MBA for WX',
      courseCount: '29+ courses',
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 12,
      name: 'Online PGDM',
      courseCount: '12+ courses',
      icon: <Globe className="w-8 h-8" />
    }
  ]

  const categories = propCategories || defaultCategories

  return (
    <div className="bg-[#F8FAFC] py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Explore the Best Online Courses
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#EF7D31] hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <div className="text-[#EF7D31]">
                    {category.icon}
                  </div>
                </div>
                
                {/* Course Name */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#EF7D31] transition-colors">
                  {category.name}
                </h3>
                
                {/* Course Count */}
                <p className="text-sm text-gray-500">
                  {category.courseCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
