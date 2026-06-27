"use client"

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Institution {
  name: string
  logo: string
}

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const institutions: Institution[] = [
    { name: 'SMU', logo: '/online-mba/image-1.png' },
    { name: 'Amity University', logo: '/online-mba/image-2.png' },
    { name: 'Online Manipal', logo: '/online-mba/image-3.png' },
    { name: 'Jain', logo: '/online-mba/image-4.png' },
    { name: 'Manipal', logo: '/online-mba/image-5.png' },
    { name: 'Shoolini University', logo: '/online-mba/image-6.png' },
    { name: 'UPES', logo: '/online-mba/image-7.png' },
    { name: 'GLA University', logo: '/online-mba/image-8.png' }
  ]

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Top Engineering Colleges for Your B.Tech Admissions 2026-27
          </h2>
        <p className="text-gray-600 mb-10 text-center">
            Get expert guidance and secure admission in the best B.Tech colleges across India
          </p>
        
        <div className="relative">
          {/* Navigation Buttons - Using Blue (#4A90E2) for visibility on white */}
          <button 
            className="swiper-prev-btn absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-[#4A90E2] transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button 
            className="swiper-next-btn absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-[#4A90E2] transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={25}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            navigation={{
              nextEl: '.swiper-next-btn',
              prevEl: '.swiper-prev-btn',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 }
            }}
            className="pb-14 logo-swiper"
          >
            {institutions.map((institution, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-32 flex items-center justify-center bg-white rounded-xl border border-gray-100 hover:border-[#4A90E2] transition-all duration-300 shadow-sm hover:shadow-md p-6 group">
                  <img 
                    src={institution.logo} 
                    alt={institution.name} 
                    /* Original Colors: Grayscale filter completely removed */
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                  
                  <div className="text-gray-800 font-semibold text-sm text-center hidden px-2">
                    {institution.name}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Pagination Styling */}
      <style jsx global>{`
        .logo-swiper .swiper-pagination-bullet-active {
          background: #4A90E2 !important;
        }
      `}</style>
    </div>
  )
}

export default Slider