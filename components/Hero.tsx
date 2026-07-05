'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, GraduationCap, FileText, MonitorPlay, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import SearchOverlay from './SearchOverlay'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

const slides = [
    {
        image: "https://i.pinimg.com/1200x/46/43/f8/4643f8e7ec4b3bd90e949b544bf6da15.jpg",
        title: "Engineering Excellence in India",
        subtitle: "India's #1 Ranked Engineering Institute",
        collegeName: "IIT Madras (Indian Institute of Technology)"
    },
    {
        image: "https://i.pinimg.com/736x/a3/ac/fd/a3acfd3f00a404f9ab17eb89ae5cc8f0.jpg",
        title: "Nurturing Global Business Leaders",
        subtitle: "Explore Top-Tier Management Programs",
        collegeName: "IIM Ahmedabad (Indian Institute of Management)"
    },
    {
        image: "https://i.pinimg.com/1200x/79/f9/4e/79f94eb175c510f6ac8fd9d87e5ba43c.jpg",
        title: "Center for Advanced Research",
        subtitle: "Pursue Science and Innovation in India",
        collegeName: "IISc Bangalore (Indian Institute of Science)"
    }
];

const Hero = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)
    const { openModal } = useAdmissionModal()
    
    // --- Typing Effect States ---
    const [displayedTitle, setDisplayedTitle] = useState(slides[0].title)
    const [displayedSubtitle, setDisplayedSubtitle] = useState(slides[0].subtitle)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Combined Typing Logic for Title & Subtitle
    useEffect(() => {
        let titleIndex = 0
        let subtitleIndex = 0
        const fullTitle = slides[currentSlide].title
        const fullSubtitle = slides[currentSlide].subtitle
        
        setDisplayedTitle("")
        setDisplayedSubtitle("")

        // Title Typing (Slower Speed: 80ms)
        const titleInterval = setInterval(() => {
            if (titleIndex <= fullTitle.length) {
                setDisplayedTitle(fullTitle.slice(0, titleIndex))
                titleIndex++
            } else {
                clearInterval(titleInterval)
                // Subtitle starts after title finishes
                const subInterval = setInterval(() => {
                    if (subtitleIndex <= fullSubtitle.length) {
                        setDisplayedSubtitle(fullSubtitle.slice(0, subtitleIndex))
                        subtitleIndex++
                    } else {
                        clearInterval(subInterval)
                    }
                }, 40) // Subtitle typing speed
            }
        }, 80) 

        return () => {
            clearInterval(titleInterval)
        }
    }, [currentSlide])

    const stats = [
        { icon: <GraduationCap size={20} />, label: "6000+ Institutions" },
        { icon: <FileText size={20} />, label: "200+ Exams" },
        { icon: <MonitorPlay size={20} />, label: "200+ Online Courses" },
        { icon: <BookOpen size={20} />, label: "200+ Courses" },
    ]

    // Auto-slide rotation (Increased to 7s to accommodate slow typing)
    useEffect(() => {
        const startRotation = () => {
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length)
            }, 7000)
        }
        startRotation()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [slides.length])

    const nextSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <section className="relative min-h-[400px] sm:h-[500px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                    style={{ backgroundImage: `url('${slides[currentSlide].image}')` }}
                >
                    <div className="absolute bottom-4 left-2 sm:left-4 text-white right-2 sm:right-auto">
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                            <p className="text-[10px] sm:text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-none">{slides[currentSlide].collegeName}</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button onClick={prevSlide} className="absolute left-1 sm:left-4 z-20 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition-colors">
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            </button>
            <button onClick={nextSlide} className="absolute right-1 sm:right-4 z-20 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition-colors">
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10 w-full max-w-5xl px-6 text-center text-white">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg min-h-[2.5rem] sm:min-h-[3.5rem] md:min-h-[4rem]">
                    {displayedTitle}
                    <span className="animate-pulse text-[#F27121]">|</span>
                </h1>

                <p className="text-sm sm:text-base md:text-xl mb-4 sm:mb-8 text-gray-100 min-h-[1.25rem] sm:min-h-[1.75rem]">
                    {displayedSubtitle}
                </p>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-8">
                    {stats.map((item, index) => (
                        <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20">
                            <span className="text-[#F27121] bg-white p-0.5 sm:p-1 rounded-full flex items-center justify-center">
                                {item.icon}
                            </span>
                            <span className="text-[10px] sm:text-sm font-medium whitespace-nowrap">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Search Bar */}
                <div 
                    className="max-w-3xl mx-auto bg-white rounded-lg p-1 sm:p-1.5 flex items-center shadow-lg cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                >
                    <div className="flex-1 flex items-center px-2 sm:px-4">
                        <input
                            type="text"
                            placeholder="Search Colleges, Courses, Exams..."
                            className="w-full py-1.5 sm:py-2 bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500 outline-none cursor-pointer text-xs sm:text-sm"
                            readOnly
                        />
                    </div>
                    <button className="bg-[#F27121] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md font-medium hover:bg-[#E05A1B] transition-colors text-xs sm:text-sm">
                        Search
                    </button>
                </div>

                <div className="mt-3 flex justify-center">
                    <button
                        onClick={() => openModal('Counselling')}
                        className="rounded-full bg-[#F27121] px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition hover:bg-[#E05A1B]"
                    >
                        Need Counselling
                    </button>
                </div>
            </div>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </section>
    )
}

export default Hero