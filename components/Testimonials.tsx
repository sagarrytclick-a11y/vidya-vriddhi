'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote, GraduationCap, Briefcase, Award } from 'lucide-react'

interface TestimonialProps {
  name: string
  role: string
  college: string
  image: string
  content: string
  rating: number
  category: string
  achievement?: string
}

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  name, 
  role, 
  college, 
  image, 
  content, 
  rating, 
  category,
  achievement 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
            <p className="text-gray-600 text-sm">{role}</p>
            <p className="text-orange-500 text-sm font-medium">{college}</p>
          </div>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg">
          <Quote className="w-6 h-6 text-orange-500" />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">({rating}.0)</span>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed flex-1 mb-6">
        "{content}"
      </p>

      {/* Achievement */}
      {achievement && (
        <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
          <Award className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-medium text-orange-700">{achievement}</span>
        </div>
      )}

      {/* Category Badge */}
      <div className="mt-4">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
          {category}
        </span>
      </div>
    </div>
  )
}

const Testimonials: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filters = ['All', 'Success Stories', 'College Admissions', 'Study Abroad', 'Career Guidance']

  const testimonials: TestimonialProps[] = [
    {
      name: "Priya Sharma",
      role: "B.Tech CSE Student",
      college: "IIT Delhi",
      image: "",
      content: "Vidya Vridhi helped me choose the right engineering college and prepare for JEE Advanced. Their college predictor was spot-on and the counseling sessions were invaluable. I'm now studying my dream course at IIT Delhi!",
      rating: 5,
      category: "Success Stories",
      achievement: "JEE Advanced AIR 342"
    },
    {
      name: "Rahul Kumar",
      role: "MBA Student",
      college: "IIM Ahmedabad",
      image: "",
      content: "The MBA admission guidance I received was exceptional. From CAT preparation to GD/PI sessions, every aspect was covered. Thanks to Vidya Vridhi, I secured admission to my dream B-school.",
      rating: 5,
      category: "College Admissions",
      achievement: "CAT 99.2 Percentile"
    },
    {
      name: "Ananya Patel",
      role: "Medical Student",
      college: "AIIMS Delhi",
      image: "",
      content: "The NEET preparation resources and mock tests were comprehensive. The detailed analysis of my performance helped me identify weak areas and improve. Grateful for the support that led to AIIMS admission.",
      rating: 5,
      category: "Success Stories",
      achievement: "NEET AIR 156"
    },
    {
      name: "Arjun Mehta",
      role: "MS in CS",
      college: "MIT, USA",
      image: "",
      content: "Study abroad guidance was exceptional. From university selection to visa application, everything was handled professionally. The scholarship assistance helped me secure funding for my master's degree.",
      rating: 5,
      category: "Study Abroad",
      achievement: "Full Scholarship"
    },
    {
      name: "Kavya Reddy",
      role: "B.Com Honors",
      college: "SRCC, Delhi University",
      image: "",
      content: "Career counseling helped me discover my interest in commerce and finance. The college recommendations based on my profile were perfect. I'm now pursuing my dream course at SRCC.",
      rating: 5,
      category: "Career Guidance",
      achievement: "12th Grade: 95%"
    },
    {
      name: "Vikram Singh",
      role: "LLB Student",
      college: "NLSIU Bangalore",
      image: "",
      content: "The law entrance preparation was comprehensive. CLAT mock tests and legal reasoning sessions were extremely helpful. I secured admission to the top law college in India.",
      rating: 5,
      category: "College Admissions",
      achievement: "CLAT AIR 89"
    },
    {
      name: "Neha Gupta",
      role: "MBBS Student",
      college: "CMC Vellore",
      image: "",
      content: "Medical college counseling was personalized and detailed. The information about different medical colleges and their specializations helped me make an informed choice.",
      rating: 5,
      category: "Success Stories",
      achievement: "NEET AIR 278"
    },
    {
      name: "Rohit Sharma",
      role: "B.Des Student",
      college: "NID Ahmedabad",
      image: "",
      content: "Design career guidance opened new horizons for me. The portfolio preparation and NID DAT coaching were exceptional. I'm now pursuing my passion for design at NID.",
      rating: 5,
      category: "Career Guidance",
      achievement: "NID DAT Rank 12"
    },
    {
      name: "Divya Nair",
      role: "M.Sc Data Science",
      college: "University of Toronto",
      image: "",
      content: "The study abroad team made my application process seamless. From SOP writing to university shortlisting, every step was guided. I'm now studying data science at a top Canadian university.",
      rating: 5,
      category: "Study Abroad",
      achievement: "75% Scholarship"
    }
  ]

  const filteredTestimonials = activeFilter === 'All' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeFilter)

  const visibleTestimonials = filteredTestimonials.slice(currentIndex, currentIndex + 3)

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 3))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(filteredTestimonials.length - 3, prev + 3))
  }

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Student <span className="text-orange-500">Success Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from thousands of students who achieved their dreams with our guidance and support
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter)
                setCurrentIndex(0)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          {/* Navigation Buttons */}
          {filteredTestimonials.length > 3 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.ceil(filteredTestimonials.length / 3) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i * 3)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentIndex === i * 3 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                disabled={currentIndex >= filteredTestimonials.length - 3}
                className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">50,000+</div>
            <p className="text-gray-600">Success Stories</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">95%</div>
            <p className="text-gray-600">Success Rate</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9/5</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
            <p className="text-gray-600">Partner Colleges</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Start Your Success Journey Today
            </h3>
            <p className="mb-6 opacity-90">
              Join thousands of successful students who achieved their dreams with our guidance
            </p>
            <button className="px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-50 transition-colors font-bold">
              Get Free Counseling
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
