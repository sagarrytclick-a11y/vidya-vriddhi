'use client'

import React, { useState } from 'react'
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react'

interface NewsCardProps {
  title: string
  date: string
  description: string
  category: string
}

const NewsCard: React.FC<NewsCardProps> = ({ title, date, description, category }) => {
  return (
    <div className="shrink-0 w-96 bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium text-sm">
            <span>Read more</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const LatestNewsStories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Exam Alerts')
  
  const categories = ['Exam Alerts', 'College Alerts', 'Admission Alerts']

  const getNewsData = (): NewsCardProps[] => {
    switch (selectedCategory) {
      case 'Exam Alerts':
        return [
          {
            title: 'JEE Main 2025 Session 2 Registration Begins; Check How to Apply',
            date: 'Feb 7, 2025',
            description: 'The National Testing Agency (NTA) has started the registration process for JEE Main 2025 Session 2. Candidates can apply online through the official website. The last date to apply is March 7, 2025.',
            category: 'Exam Alerts'
          },
          {
            title: 'NEET UG 2025 Application Form Released; Check Important Dates',
            date: 'Feb 6, 2025',
            description: 'NTA has released the NEET UG 2025 application form. The exam is scheduled for May 5, 2025. Candidates must complete the registration process before the deadline.',
            category: 'Exam Alerts'
          },
          {
            title: 'CUET UG 2025 Registration Process Started; Apply Before March 26',
            date: 'Feb 5, 2025',
            description: 'The Common University Entrance Test (CUET) UG 2025 registration has begun. Students can apply for admission to various central universities and participating institutions.',
            category: 'Exam Alerts'
          },
          {
            title: 'GATE 2025 Result to be Declared on March 16; Check Details',
            date: 'Feb 4, 2025',
            description: 'IIT Roorkee will announce the GATE 2025 results on March 16, 2025. Candidates can check their scores on the official website and download their scorecards.',
            category: 'Exam Alerts'
          },
          {
            title: 'CAT 2024 Final Answer Key Released; Objection Window Open',
            date: 'Feb 3, 2025',
            description: 'IIM Calcutta has released the CAT 2024 final answer key. Candidates can raise objections if any discrepancies are found in the answer key.',
            category: 'Exam Alerts'
          }
        ]
      case 'College Alerts':
        return [
          {
            title: 'IIT Delhi Launches New AI and Machine Learning Program',
            date: 'Feb 8, 2025',
            description: 'IIT Delhi has introduced a new undergraduate program in Artificial Intelligence and Machine Learning. The program will start from the academic session 2025-26 with 60 seats.',
            category: 'College Alerts'
          },
          {
            title: 'IIM Ahmedabad Announces New Executive MBA Program',
            date: 'Feb 7, 2025',
            description: 'IIM Ahmedabad has launched a new Executive MBA program for working professionals. The program will be conducted in hybrid mode with weekend classes.',
            category: 'College Alerts'
          },
          {
            title: 'Delhi University Increases Seats in Popular Courses',
            date: 'Feb 6, 2025',
            description: 'Delhi University has increased the number of seats in B.Com Honors and BA Economics programs for the upcoming academic session 2025-26.',
            category: 'College Alerts'
          },
          {
            title: 'IIT Bombay Establishes New Research Center for Quantum Computing',
            date: 'Feb 5, 2025',
            description: 'IIT Bombay has set up a state-of-the-art research center for Quantum Computing. The center will focus on advanced research in quantum technologies.',
            category: 'College Alerts'
          },
          {
            title: 'AIIMS Delhi Starts New Super Specialty Department',
            date: 'Feb 4, 2025',
            description: 'AIIMS Delhi has established a new super specialty department for Robotic Surgery. The department will offer advanced treatment options using robotic technology.',
            category: 'College Alerts'
          }
        ]
      case 'Admission Alerts':
        return [
          {
            title: 'DU Admission 2025: Application Process to Begin from May 15',
            date: 'Feb 9, 2025',
            description: 'Delhi University will start the admission process for undergraduate courses from May 15, 2025. The admission will be based on CUET UG scores.',
            category: 'Admission Alerts'
          },
          {
            title: 'IIT Admissions 2025: JoSAA Schedule Released',
            date: 'Feb 8, 2025',
            description: 'The Joint Seat Allocation Authority (JoSAA) has released the schedule for IIT admissions 2025. The counseling process will begin in June after JEE Advanced results.',
            category: 'Admission Alerts'
          },
          {
            title: 'NEET PG 2025 Counseling Dates Announced',
            date: 'Feb 7, 2025',
            description: 'The Medical Counseling Committee (MCC) has announced the dates for NEET PG 2025 counseling. The first round of counseling will start from March 2025.',
            category: 'Admission Alerts'
          },
          {
            title: 'CLAT 2025 Admission Process Begins at NLUs',
            date: 'Feb 6, 2025',
            description: 'National Law Universities have started the admission process based on CLAT 2025 scores. Candidates can apply to their preferred NLUs through the centralized process.',
            category: 'Admission Alerts'
          },
          {
            title: 'NIT Admissions 2025: CSAB-NEUT Schedule Released',
            date: 'Feb 5, 2025',
            description: 'The Central Seat Allocation Board (CSAB) has released the NEUT schedule for NIT admissions 2025. The special round counseling will be conducted in July.',
            category: 'Admission Alerts'
          }
        ]
      default:
        return []
    }
  }

  const newsItems = getNewsData()

  const scrollRight = () => {
    const element = document.getElementById('news-scroll-container')
    if (element) {
      element.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest News & Stories</h2>
          <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium">
            <span>View all news</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Cards Horizontal Scroll */}
        <div className="relative">
          <div
            id="news-scroll-container"
            className="flex space-x-6 overflow-x-auto pb-4 scroll-smooth"
          >
            {newsItems.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
          
          {/* Right Navigation Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LatestNewsStories
