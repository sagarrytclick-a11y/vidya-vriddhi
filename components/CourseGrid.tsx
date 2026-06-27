'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, Clock, Star, Users, Award, TrendingUp } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface Course {
  id: number
  title: string
  provider: string
  duration: string
  level: string
  rating: number
  students: number
  price: string
  originalPrice?: string
  category: string
  image: string
  description: string
  highlights: string[]
}

interface CourseGridProps {
  courses?: Course[]
}

export default function CourseGrid({ courses: propCourses }: CourseGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const { openModal } = useAdmissionModal()

  // Default course data if not provided
  const defaultCourses: Course[] = [
    {
      id: 1,
      title: 'Executive MBA Program',
      provider: 'Online Manipal',
      duration: '18 months',
      level: 'Post Graduate',
      rating: 4.8,
      students: 12500,
      price: '₹75,000',
      originalPrice: '₹1,20,000',
      category: 'Executive MBA',
      image: 'https://i.pinimg.com/736x/88/c2/a6/88c2a619772b9141295e766ca769cd55.jpg',
      description: 'Advanced MBA program for working professionals with focus on leadership and strategic management',
      highlights: ['UGC Approved', 'Weekend Classes', 'Industry Projects', 'Placement Support']
    },
    {
      id: 2,
      title: 'MBA in Digital Business',
      provider: 'Amity University',
      duration: '24 months',
      level: 'Post Graduate',
      rating: 4.7,
      students: 8900,
      price: '₹85,000',
      originalPrice: '₹1,30,000',
      category: 'Digital MBA',
      image: 'https://i.pinimg.com/1200x/18/d5/25/18d5250616860ff0893e7dfb4bef4169.jpg',
      description: 'Specialized MBA focusing on digital transformation and e-commerce strategies',
      highlights: ['Digital Marketing', 'E-commerce', 'Analytics', 'Innovation Lab']
    },
    {
      id: 3,
      title: 'MBA in Finance',
      provider: 'UPES',
      duration: '20 months',
      level: 'Post Graduate',
      rating: 4.9,
      students: 6700,
      price: '₹95,000',
      originalPrice: '₹1,40,000',
      category: 'Finance MBA',
      image: 'https://i.pinimg.com/736x/66/09/82/6609829e896f7ff22bc27a17be68e0ec.jpg',
      description: 'Comprehensive MBA program with specialization in financial management and investment',
      highlights: ['NSE Certified', 'Portfolio Management', 'Risk Analysis', 'FinTech']
    },
    {
      id: 5,
      title: 'MBA in International Business',
      provider: 'SMU',
      duration: '24 months',
      level: 'Post Graduate',
      rating: 4.7,
      students: 3200,
      price: '₹90,000',
      originalPrice: '₹1,35,000',
      category: 'International MBA',
      image: 'https://i.pinimg.com/1200x/26/30/97/2630975665e0d4186bc427a09b6df808.jpg',
      description: 'Global business management with focus on international trade and cross-border operations',
      highlights: ['Global Curriculum', 'Exchange Programs', 'Trade Laws', 'Export Management']
    },
    {
      id: 6,
      title: 'MBA in Operations Management',
      provider: 'Shoolini University',
      duration: '18 months',
      level: 'Post Graduate',
      rating: 4.8,
      students: 4100,
      price: '₹70,000',
      originalPrice: '₹1,10,000',
      category: 'Operations MBA',
      image: 'https://i.pinimg.com/736x/64/ae/61/64ae613c43d98ab426773a4f6fcceada.jpg',
      description: 'Focus on supply chain, logistics, and operations excellence in modern businesses',
      highlights: ['Supply Chain', 'Logistics', 'Quality Control', 'ERP Systems']
    },
    {
      id: 7,
      title: 'MBA in Business Analytics',
      provider: 'Online Manipal',
      duration: '16 months',
      level: 'Post Graduate',
      rating: 4.5,
      students: 2800,
      price: '₹88,000',
      originalPrice: '₹1,20,000',
      category: 'Analytics MBA',
      image: 'https://i.pinimg.com/736x/21/cd/db/21cddb74575b61eb8ae6da10b375ad30.jpg',
      description: 'Data-driven MBA program combining business management with advanced analytics',
      highlights: ['Data Science', 'Business Intelligence', 'Machine Learning', 'Predictive Analytics']
    }
  ]

  const courses = propCourses || defaultCourses

  const categories = [...new Set(courses.map(course => course.category))]
  const levels = [...new Set(courses.map(course => course.level))]

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [courses, searchTerm, selectedCategory, selectedLevel])

  return (
    <div className=" bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Online Courses</h1>
          <p className="text-gray-600">Discover the best online courses from top universities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-orange-200 sticky top-0 z-10 shadow-sm">
        
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={30}
                loop={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false
                }}
                navigation={true}
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
                className="pb-16"
              >
                {filteredCourses.map(course => (
                  <SwiperSlide key={course.id}>
                    <div className="bg-white rounded-xl border border-orange-200 hover:border-orange-400 transition-all overflow-hidden h-full shadow-sm">
                      {/* Course Image */}
                      <div className="h-48 bg-gray-100 relative">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        {course.originalPrice && (
                          <div className="absolute top-3 right-3 bg-[#EF7D31] text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round((1 - (parseInt(course.price.replace('₹', '').replace(',', '')) / parseInt(course.originalPrice.replace('₹', '').replace(',', '')))) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Course Content */}
                      <div className="p-6">
                        {/* Provider */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">{course.provider}</span>
                          <span className="text-xs bg-orange-100 text-[#EF7D31] px-2 py-1 rounded-full">
                            {course.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.highlights.slice(0, 2).map((highlight, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#EF7D31]" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold text-[#EF7D31]">{course.price}</div>
                            {course.originalPrice && (
                              <div className="text-sm text-gray-400 line-through">{course.originalPrice}</div>
                            )}
                          </div>
                          <button onClick={() => openModal()} className="bg-[#EF7D31] hover:bg-[#f66505] text-white px-4 py-2 rounded-lg transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Results Count */}
            <div className="mt-8 text-center text-gray-500">
              Showing {filteredCourses.length} of {courses.length} MBA courses
            </div>
          </>
        )}
      </div>
    </div>
  )
}
