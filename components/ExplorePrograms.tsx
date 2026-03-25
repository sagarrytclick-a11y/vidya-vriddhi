'use client'

import React, { useState } from 'react'
import { FileText, Building, Globe, FileText as FileIcon, ChevronRight } from 'lucide-react'

interface ProgramCardProps {
  icon: React.ReactNode
  title: string
  description: string
  tags?: string[]
  links?: string[]
  actionText: string
}

const ProgramCard: React.FC<ProgramCardProps> = ({ icon, title, description, tags, links, actionText }) => {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      {/* Icon with Brand Highlights */}
      <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
          {description}
        </p>
        
        {tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {links && (
          <ul className="space-y-2.5 mb-6">
            {links.map((link, index) => (
              <li key={index} className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                {link}
              </li>
            ))}
          </ul>
        )}
        
        <button className="mt-auto flex items-center justify-between w-full px-5 py-3.5 bg-gray-50 group-hover:bg-orange-600 text-gray-700 group-hover:text-white text-sm font-bold rounded-xl transition-all duration-300">
          <span>{actionText.split('>')[0].trim()}</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}

const ExplorePrograms: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState('All')
  const programs = ['All', 'Courses', 'MBBS Colleges', 'B.Com Colleges', 'B.Tech Colleges', 'BA Colleges', 'B.Sc Colleges', 'BCA Colleges', 'Law Colleges']
  
  // Logic for getProgramCards remains the same as your original snippet
  const getProgramCards = (): ProgramCardProps[] => {
    switch (selectedProgram) {
        case 'All':
          return [
            {
              icon: <Building />,
              title: 'All Colleges',
              description: 'Explore top colleges across all streams by location, eligibility, infrastructure, and rankings',
              links: ['Top colleges in Bangalore', 'Best colleges in Delhi'],
              actionText: 'Browse All Colleges in India >'
            },
            {
              icon: <FileText />,
              title: 'College Exams',
              description: 'Get details on entrance exams, dates, preparation tips, eligibility, and more.',
              tags: ['JEE', 'NEET', 'CUET'],
              actionText: 'Explore All College Exams >'
            },
            {
              icon: <Globe />,
              title: 'College Predictor',
              description: 'Find out where you\'re likely to get admission based on your rank, category, and preferences',
              tags: ['JEE Predictor', 'NEET Predictor', 'CUET Predictor'],
              actionText: 'Predict Your College Admission Chances >'
            }
          ]
        // ... (Include other cases here)
        default: return []
      }
  }

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Explore <span className="text-orange-500">Programs</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need for your academic journey—from finding the right college to predicting your admission chances.
          </p>
        </div>
        
        {/* Tabs - Centered & Scrollable on Mobile */}
        <div className="flex justify-start md:justify-center mb-12 overflow-x-auto no-scrollbar pb-2">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
            {programs.map((program) => (
              <button
                key={program}
                onClick={() => setSelectedProgram(program)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedProgram === program
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {program}
              </button>
            ))}
          </div>
        </div>
        
        {/* The Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getProgramCards().map((card, index) => (
            <ProgramCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExplorePrograms