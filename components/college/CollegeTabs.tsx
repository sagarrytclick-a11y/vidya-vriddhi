'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  Info, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Scissors,
  Award,
  Building2,
  MessageSquare,
  ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: 'about', label: 'Info', icon: <Info className="w-4 h-4" /> },
  { id: 'courses', label: 'Courses & Fees', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'admission', label: 'Admissions', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'placements', label: 'Placements', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'cutoff', label: 'Cutoffs', icon: <Scissors className="w-4 h-4" /> },
  { id: 'scholarship', label: 'Scholarships', icon: <Award className="w-4 h-4" /> },
  { id: 'ranking', label: 'Rankings', icon: <Award className="w-4 h-4" /> },
  { id: 'hostel', label: 'Hostel', icon: <Building2 className="w-4 h-4" /> },
  { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
]

export function CollegeTabs() {
  const [activeTab, setActiveTab] = useState('about')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0.1,
      }
    )

    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollToTab = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 150
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('tabs-container')
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  // Check scroll buttons visibility
  useEffect(() => {
    const container = document.getElementById('tabs-container')
    if (!container) return

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      )
    }

    container.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => container.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:top-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Left Arrow */}
          <button
            onClick={() => handleScroll('left')}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              canScrollLeft 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tabs Container */}
          <div 
            id="tabs-container"
            className="flex-1 overflow-x-auto scrollbar-hide"
          >
            <div className="flex items-center gap-1 py-3 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleScroll('right')}
            className={cn(
              'p-2 rounded-full transition-all duration-200',
              canScrollRight 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
