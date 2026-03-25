'use client'

import React, { useState } from 'react'
import { ArrowUp, ArrowDown, Calendar, DollarSign, Info } from 'lucide-react'

interface CollegeData {
  rank: number
  name: string
  ranking: string
  cutoff: string
  applicationDeadline: string
  totalFees: string
  rankingChange?: 'up' | 'down' | 'same'
}

const TopColleges: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('BE/B.Tech')
  
  const courses = [
    'BE/B.Tech',
    'MBA/PGDM',
    'MBBS',
    'BBA',
    'B.Com',
    'BA',
    'B.Sc',
    'BCA',
    'B.Pharma',
    'Law'
  ]

  const getCollegeData = (): CollegeData[] => {
    switch (selectedCourse) {
      case 'BE/B.Tech':
        return [
          {
            rank: 1,
            name: 'IIT Madras',
            ranking: '#1 out of 671',
            cutoff: 'JEE Advanced: 1-590',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'same'
          },
          {
            rank: 2,
            name: 'IIT Delhi',
            ranking: '#2 out of 671',
            cutoff: 'JEE Advanced: 1-1102',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'same'
          },
          {
            rank: 3,
            name: 'IIT Bombay',
            ranking: '#3 out of 671',
            cutoff: 'JEE Advanced: 1-1590',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'up'
          },
          {
            rank: 4,
            name: 'IIT Kanpur',
            ranking: '#4 out of 671',
            cutoff: 'JEE Advanced: 1-2500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'down'
          },
          {
            rank: 5,
            name: 'IIT Roorkee',
            ranking: '#5 out of 671',
            cutoff: 'JEE Advanced: 1-3500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'same'
          },
          {
            rank: 6,
            name: 'IIT Kharagpur',
            ranking: '#6 out of 671',
            cutoff: 'JEE Advanced: 1-4500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'up'
          },
          {
            rank: 7,
            name: 'IIT Guwahati',
            ranking: '#7 out of 671',
            cutoff: 'JEE Advanced: 1-5500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'down'
          },
          {
            rank: 8,
            name: 'IIT Hyderabad',
            ranking: '#8 out of 671',
            cutoff: 'JEE Advanced: 1-6500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹8.57 L - ₹10.23 L',
            rankingChange: 'same'
          },
          {
            rank: 9,
            name: 'NIT Trichy',
            ranking: '#9 out of 671',
            cutoff: 'JEE Main: 1-8500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹5.12 L - ₹7.23 L',
            rankingChange: 'up'
          },
          {
            rank: 10,
            name: 'NIT Surathkal',
            ranking: '#10 out of 671',
            cutoff: 'JEE Main: 1-9500',
            applicationDeadline: 'Jun 2025',
            totalFees: '₹5.12 L - ₹7.23 L',
            rankingChange: 'same'
          }
        ]
      case 'MBA/PGDM':
        return [
          {
            rank: 1,
            name: 'IIM Ahmedabad',
            ranking: '#1 out of 354',
            cutoff: 'CAT: 99-100 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹23.20 L - ₹25.60 L',
            rankingChange: 'same'
          },
          {
            rank: 2,
            name: 'IIM Bangalore',
            ranking: '#2 out of 354',
            cutoff: 'CAT: 98-100 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹23.20 L - ₹25.60 L',
            rankingChange: 'same'
          },
          {
            rank: 3,
            name: 'IIM Calcutta',
            ranking: '#3 out of 354',
            cutoff: 'CAT: 98-100 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹23.20 L - ₹25.60 L',
            rankingChange: 'up'
          },
          {
            rank: 4,
            name: 'IIM Lucknow',
            ranking: '#4 out of 354',
            cutoff: 'CAT: 96-99 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹20.15 L - ₹22.80 L',
            rankingChange: 'down'
          },
          {
            rank: 5,
            name: 'IIM Kozhikode',
            ranking: '#5 out of 354',
            cutoff: 'CAT: 95-99 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹18.75 L - ₹21.20 L',
            rankingChange: 'same'
          },
          {
            rank: 6,
            name: 'IIM Indore',
            ranking: '#6 out of 354',
            cutoff: 'CAT: 94-98 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹17.25 L - ₹19.80 L',
            rankingChange: 'up'
          },
          {
            rank: 7,
            name: 'XLRI Jamshedpur',
            ranking: '#7 out of 354',
            cutoff: 'XAT: 95-99 percentile',
            applicationDeadline: 'Dec 2025',
            totalFees: '₹22.50 L - ₹24.80 L',
            rankingChange: 'same'
          },
          {
            rank: 8,
            name: 'FMS Delhi',
            ranking: '#8 out of 354',
            cutoff: 'CAT: 97-100 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹9.60 L - ₹11.20 L',
            rankingChange: 'down'
          },
          {
            rank: 9,
            name: 'SPJIMR Mumbai',
            ranking: '#9 out of 354',
            cutoff: 'CAT: 95-99 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹18.75 L - ₹21.20 L',
            rankingChange: 'up'
          },
          {
            rank: 10,
            name: 'IIM Shillong',
            ranking: '#10 out of 354',
            cutoff: 'CAT: 92-96 percentile',
            applicationDeadline: 'Nov 2025',
            totalFees: '₹16.80 L - ₹19.20 L',
            rankingChange: 'same'
          }
        ]
      default:
        return []
    }
  }

  const colleges = getCollegeData()

  const getRankingIcon = (change?: 'up' | 'down' | 'same') => {
    switch (change) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Top 10 Colleges</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <Info className="w-5 h-5" />
            <span>Explore all colleges</span>
          </button>
        </div>

        {/* Course Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => setSelectedCourse(course)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCourse === course
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {course}
            </button>
          ))}
        </div>

        {/* Colleges Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cutoff
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Fees
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.map((college) => (
                  <tr key={college.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">#{college.rank}</span>
                        {getRankingIcon(college.rankingChange)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 hover:text-orange-500 cursor-pointer">
                        {college.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {college.ranking}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {college.cutoff}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{college.applicationDeadline}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{college.totalFees}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopColleges
