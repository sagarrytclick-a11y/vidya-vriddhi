'use client'

import React, { useState } from 'react'
import { Clock, DollarSign, Building, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

interface CourseCardProps {
  name: string
  duration: string
  averageFees: string
  collegesCount: number
  isFullTime: boolean
}

const CourseCard: React.FC<CourseCardProps> = ({ name, duration, averageFees, collegesCount, isFullTime }) => {
  return (
    <div className="shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{name}</h3>
          </div>
          {isFullTime && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium shrink-0">
              Full Time
            </span>
          )}
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span>{averageFees}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{collegesCount} Colleges</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium w-full justify-center">
            <span>Course Overview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const TopCourses: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('UG')
  
  const categories = ['UG', 'PG', 'Diploma', 'Certificate', 'PhD', 'Executive']

  const getCourseData = (): CourseCardProps[] => {
    switch (selectedCategory) {
      case 'UG':
        return [
          {
            name: 'Bachelor of Commerce (B.Com.)',
            duration: '3 Years',
            averageFees: '₹5K - ₹2L',
            collegesCount: 6891,
            isFullTime: true
          },
          {
            name: 'Bachelor of Technology (B.Tech)',
            duration: '4 Years',
            averageFees: '₹10K - ₹10L',
            collegesCount: 4562,
            isFullTime: true
          },
          {
            name: 'Bachelor of Arts (BA)',
            duration: '3 Years',
            averageFees: '₹3K - ₹1L',
            collegesCount: 5234,
            isFullTime: true
          },
          {
            name: 'Bachelor of Science (B.Sc)',
            duration: '3 Years',
            averageFees: '₹5K - ₹2L',
            collegesCount: 4123,
            isFullTime: true
          },
          {
            name: 'Bachelor of Business Administration (BBA)',
            duration: '3 Years',
            averageFees: '₹20K - ₹5L',
            collegesCount: 3456,
            isFullTime: true
          },
          {
            name: 'Bachelor of Computer Applications (BCA)',
            duration: '3 Years',
            averageFees: '₹10K - ₹3L',
            collegesCount: 2890,
            isFullTime: true
          },
          {
            name: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
            duration: '5.5 Years',
            averageFees: '₹10K - ₹50L',
            collegesCount: 567,
            isFullTime: true
          },
          {
            name: 'Bachelor of Laws (LLB)',
            duration: '3 Years',
            averageFees: '₹5K - ₹2L',
            collegesCount: 1876,
            isFullTime: true
          }
        ]
      case 'PG':
        return [
          {
            name: 'Master of Business Administration (MBA)',
            duration: '2 Years',
            averageFees: '₹20K - ₹25L',
            collegesCount: 3542,
            isFullTime: true
          },
          {
            name: 'Master of Technology (M.Tech)',
            duration: '2 Years',
            averageFees: '₹10K - ₹5L',
            collegesCount: 2345,
            isFullTime: true
          },
          {
            name: 'Master of Commerce (M.Com)',
            duration: '2 Years',
            averageFees: '₹5K - ₹1L',
            collegesCount: 3123,
            isFullTime: true
          },
          {
            name: 'Master of Arts (MA)',
            duration: '2 Years',
            averageFees: '₹3K - ₹1L',
            collegesCount: 2890,
            isFullTime: true
          },
          {
            name: 'Master of Science (M.Sc)',
            duration: '2 Years',
            averageFees: '₹5K - ₹2L',
            collegesCount: 2456,
            isFullTime: true
          },
          {
            name: 'Master of Computer Applications (MCA)',
            duration: '3 Years',
            averageFees: '₹10K - ₹3L',
            collegesCount: 1234,
            isFullTime: true
          }
        ]
      case 'Diploma':
        return [
          {
            name: 'Diploma in Engineering',
            duration: '3 Years',
            averageFees: '₹5K - ₹50K',
            collegesCount: 3456,
            isFullTime: true
          },
          {
            name: 'Diploma in Management',
            duration: '1 Year',
            averageFees: '₹10K - ₹1L',
            collegesCount: 2345,
            isFullTime: true
          },
          {
            name: 'Diploma in Computer Applications',
            duration: '1 Year',
            averageFees: '₹5K - ₹50K',
            collegesCount: 1876,
            isFullTime: true
          }
        ]
      case 'Certificate':
        return [
          {
            name: 'Certificate in Digital Marketing',
            duration: '6 Months',
            averageFees: '₹5K - ₹25K',
            collegesCount: 456,
            isFullTime: false
          },
          {
            name: 'Certificate in Data Science',
            duration: '3 Months',
            averageFees: '₹10K - ₹50K',
            collegesCount: 234,
            isFullTime: false
          },
          {
            name: 'Certificate in Web Development',
            duration: '6 Months',
            averageFees: '₹8K - ₹30K',
            collegesCount: 567,
            isFullTime: false
          }
        ]
      case 'PhD':
        return [
          {
            name: 'PhD in Engineering',
            duration: '3-5 Years',
            averageFees: '₹10K - ₹2L',
            collegesCount: 890,
            isFullTime: true
          },
          {
            name: 'PhD in Management',
            duration: '3-5 Years',
            averageFees: '₹15K - ₹3L',
            collegesCount: 567,
            isFullTime: true
          },
          {
            name: 'PhD in Sciences',
            duration: '3-5 Years',
            averageFees: '₹8K - ₹1.5L',
            collegesCount: 1234,
            isFullTime: true
          }
        ]
      case 'Executive':
        return [
          {
            name: 'Executive MBA',
            duration: '1-2 Years',
            averageFees: '₹5L - ₹30L',
            collegesCount: 234,
            isFullTime: false
          },
          {
            name: 'Executive PG Program',
            duration: '1 Year',
            averageFees: '₹2L - ₹10L',
            collegesCount: 123,
            isFullTime: false
          },
          {
            name: 'Executive Certificate Program',
            duration: '6 Months',
            averageFees: '₹1L - ₹5L',
            collegesCount: 89,
            isFullTime: false
          }
        ]
      default:
        return []
    }
  }

  const courses = getCourseData()

  const scrollLeft = () => {
    const element = document.getElementById('courses-scroll-container')
    if (element) {
      element.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const element = document.getElementById('courses-scroll-container')
    if (element) {
      element.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Top Courses</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>View all courses</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex space-x-2 overflow-x-auto flex-1" id="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <button
            onClick={scrollRight}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Course Cards */}
        <div className="relative">
          <div
            id="courses-scroll-container"
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
          >
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopCourses
