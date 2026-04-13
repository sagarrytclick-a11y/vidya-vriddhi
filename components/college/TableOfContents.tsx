'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Bookmark, ChevronRight } from 'lucide-react'

interface Section {
  id: string
  title: string
}

interface TableOfContentsProps {
  sections: Section[]
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sections])

  // Track sticky state
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsSticky(scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 120
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300',
        isSticky && 'shadow-lg ring-1 ring-blue-100'
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          Table of Contents
        </h3>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-3 group',
              activeSection === section.id
                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm ring-1 ring-blue-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <span 
              className={cn(
                'w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition-colors',
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
              )}
            >
              {index + 1}
            </span>
            <span className="flex-1">{section.title}</span>
            <ChevronRight 
              className={cn(
                'w-4 h-4 transition-all duration-200',
                activeSection === section.id 
                  ? 'opacity-100 translate-x-0 text-blue-600' 
                  : 'opacity-0 -translate-x-2 group-hover:opacity-50'
              )} 
            />
          </button>
        ))}
      </nav>

      {/* Footer decoration */}
      <div className="px-5 pb-4">
        <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full" />
      </div>
    </div>
  )
}
