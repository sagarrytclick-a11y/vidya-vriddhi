'use client'

import React from 'react'
import { Calendar, Clock, ExternalLink } from 'lucide-react'

interface ExamCardProps {
  name: string
  date: string
  isOnline?: boolean
}

const ExamCard: React.FC<ExamCardProps> = ({ name, date, isOnline }) => {
  return (
    <div className="shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{date}</span>
            </div>
          </div>
          {isOnline && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Online
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Upcoming</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
            <ExternalLink className="w-4 h-4" />
            <span>Exam Info</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const UpcomingExams: React.FC = () => {
  const exams: ExamCardProps[] = [
    {
      name: 'JEE Main 2025',
      date: 'Apr 4, 2025 - Apr 15, 2025',
      isOnline: true
    },
    {
      name: 'NEET 2025',
      date: 'May 5, 2025',
      isOnline: true
    },
    {
      name: 'CUET UG 2025',
      date: 'May 15, 2025 - May 31, 2025',
      isOnline: true
    },
    {
      name: 'GATE 2025',
      date: 'Feb 3, 2025 - Feb 11, 2025',
      isOnline: true
    },
    {
      name: 'CAT 2025',
      date: 'Nov 24, 2025',
      isOnline: true
    },
    {
      name: 'XAT 2025',
      date: 'Jan 7, 2025',
      isOnline: true
    },
    {
      name: 'MAT 2025',
      date: 'Feb 23, 2025',
      isOnline: true
    },
    {
      name: 'CMAT 2025',
      date: 'Apr 25, 2025',
      isOnline: true
    },
    {
      name: 'SNAP 2025',
      date: 'Dec 10, 2025 - Dec 23, 2025',
      isOnline: true
    },
    {
      name: 'IIFT 2025',
      date: 'Dec 8, 2025',
      isOnline: true
    }
  ]

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Upcoming Exams</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>View all exams</span>
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* Exam Cards Horizontal Scroll */}
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {exams.map((exam, index) => (
            <ExamCard key={index} {...exam} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default UpcomingExams
