'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, GraduationCap, FileText, MonitorPlay, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false })

const slides = [
  {
    image: 'https://i.pinimg.com/1200x/46/43/f8/4643f8e7ec4b3bd90e949b544bf6da15.jpg',
    title: 'Engineering Excellence in India',
    subtitle: "India's #1 Ranked Engineering Institute",
    collegeName: 'IIT Madras (Indian Institute of Technology)',
  },
  {
    image: 'https://i.pinimg.com/736x/a3/ac/fd/a3acfd3f00a404f9ab17eb89ae5cc8f0.jpg',
    title: 'Nurturing Global Business Leaders',
    subtitle: 'Explore Top-Tier Management Programs',
    collegeName: 'IIM Ahmedabad (Indian Institute of Management)',
  },
  {
    image: 'https://i.pinimg.com/1200x/79/f9/4e/79f94eb175c510f6ac8fd9d87e5ba43c.jpg',
    title: 'Center for Advanced Research',
    subtitle: 'Pursue Science and Innovation in India',
    collegeName: 'IISc Bangalore (Indian Institute of Science)',
  },
]

const Hero = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { openModal } = useAdmissionModal()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stats = [
    { icon: <GraduationCap size={20} />, label: '6000+ Institutions' },
    { icon: <FileText size={20} />, label: '200+ Exams' },
    { icon: <MonitorPlay size={20} />, label: '200+ Online Courses' },
    { icon: <BookOpen size={20} />, label: '200+ Courses' },
  ]

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const nextSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const active = slides[currentSlide]

  return (
    <section className="relative min-h-[400px] sm:h-[500px] w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url('${active.image}')` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-2 z-10 sm:left-4">
            <div className="rounded-lg bg-white/80 px-2 py-1.5 backdrop-blur-sm sm:px-3 sm:py-2">
              <p className="max-w-[200px] truncate text-[10px] font-semibold text-gray-900 sm:max-w-none sm:text-sm">
                {active.collegeName}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-1 z-20 rounded-full bg-black/30 p-1 text-white transition-colors hover:bg-black/50 sm:left-4 sm:p-2"
      >
        <ChevronLeft size={16} className="sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-1 z-20 rounded-full bg-black/30 p-1 text-white transition-colors hover:bg-black/50 sm:right-4 sm:p-2"
      >
        <ChevronRight size={16} className="sm:h-5 sm:w-5" />
      </button>

      <div className="relative z-10 w-full max-w-5xl px-6 text-center text-white">
        <h1 className="mb-2 text-2xl font-bold drop-shadow-lg sm:mb-3 sm:text-3xl md:text-5xl">
          {active.title}
        </h1>

        <p className="mb-4 text-sm text-gray-100 sm:mb-8 sm:text-base md:text-xl">
          {active.subtitle}
        </p>

        <div className="mb-4 flex flex-wrap justify-center gap-2 sm:mb-8 sm:gap-3 md:gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-1.5 rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-sm sm:space-x-2 sm:px-4 sm:py-2"
            >
              <span className="flex items-center justify-center rounded-full bg-white p-0.5 text-[#F27121] sm:p-1">
                {item.icon}
              </span>
              <span className="whitespace-nowrap text-[10px] font-medium sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mx-auto flex max-w-3xl cursor-pointer items-center rounded-lg bg-white p-1 shadow-lg sm:p-1.5"
          onClick={() => setIsSearchOpen(true)}
        >
          <div className="flex flex-1 items-center px-2 sm:px-4">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Colleges, Courses, Exams..."
              className="w-full cursor-pointer border-none bg-transparent py-1.5 text-xs text-gray-800 outline-none placeholder:text-gray-500 focus:ring-0 sm:py-2 sm:text-sm"
              readOnly
            />
          </div>
          <button
            type="button"
            className="rounded-md bg-[#F27121] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#E05A1B] sm:px-6 sm:py-2 sm:text-sm"
          >
            Search
          </button>
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => openModal('Counselling')}
            className="rounded-full bg-[#F27121] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#E05A1B] sm:px-6 sm:py-3 sm:text-base"
          >
            Need Counselling
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </section>
  )
}

export default Hero
