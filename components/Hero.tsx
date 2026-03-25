'use client'

import React, { useState } from 'react'
import { Search, GraduationCap, FileText, MonitorPlay, BookOpen } from 'lucide-react'
import SearchOverlay from './SearchOverlay'

const Hero = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    
    const stats = [
        { icon: <GraduationCap size={20} />, label: "6000+ Institutions" },
        { icon: <FileText size={20} />, label: "200+ Exams" },
        { icon: <MonitorPlay size={20} />, label: "200+ Online Courses" },
        { icon: <BookOpen size={20} />, label: "200+ Courses" },
    ]

    return (
        <section className="relative h-150 w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{
                    backgroundImage: "url('https://i.pinimg.com/1200x/87/0a/9f/870a9fd2c38d42373301bd563c4c055b.jpg')", // Aapki uploaded file ka path
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl px-6 text-center text-white">

                {/* Main Heading */}
                <h1 className="text-4xl md:text-4xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
                    Explore Top Colleges, Exams, Results & More
                </h1>

                <p className="text-lg md:text-xl font-medium mb-8 text-gray-100 ">
                    Find Courses That Fit Your Future
                </p>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 bg-white/10 backdrop-blur-lg px-5 py-2.5 rounded-lg border border-white/30 hover:bg-white/20 transition-all cursor-default shadow-lg"
                        >
                            {/* Orange Icon Section */}
                            <span className="text-[#F27121] bg-white p-1 rounded-full flex items-center justify-center shadow-inner">
                                {item.icon}
                            </span>
                            <span className="text-sm md:text-base font-bold tracking-wide">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div 
                    className="max-w-3xl mx-auto mt-1 bg-white rounded-lg p-1.5 flex items-center shadow-2xl cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                >
                    {/* Input Area */}
                    <div className="flex-1 flex items-center px-4">
                        <input
                            type="text"
                            placeholder="Search Colleges, Courses, Exams, Questions and Article"
                            className="w-full py-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder:text-gray-500 text-sm md:text-base outline-none cursor-pointer"
                            readOnly
                        />
                    </div>

                    {/* Search Button - Inside the white bar */}
                    <button 
                        className="bg-[#F27121] text-white px-10 py-3 rounded-md font-bold transition-all duration-300 text-lg tracking-wide hover:bg-[#E05A1B]"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsSearchOpen(true)
                        }}
                    >
                        Search
                    </button>
                </div>

            </div>
            
            {/* Search Overlay */}
            <SearchOverlay 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </section>
    )
}

export default Hero