"use client"
import React, { useState } from 'react'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What are the eligibility criteria for B.Tech admission?',
      answer: 'Candidates must have completed 10+2 with Physics, Chemistry, and Mathematics. Minimum 45% marks in PCM/PCB required for most engineering colleges.'
    },
    {
      question: 'What is the duration of B.Tech programs?',
      answer: 'B.Tech is typically a 4-year undergraduate program. Some colleges offer 5-year integrated programs or dual degrees.'
    },
    {
      question: 'What are the career prospects after B.Tech?',
      answer: 'B.Tech graduates have excellent career opportunities in software development, data science, AI, machine learning, cloud computing, and traditional engineering fields with average starting salaries of ₹6-12 LPA.'
    },
    {
      question: 'Are there scholarships available for B.Tech students?',
      answer: 'Yes, many colleges offer merit-based scholarships, need-based financial aid, and government scholarships for engineering students.'
    },
    {
      question: 'What is the admission process?',
      answer: 'Most colleges accept JEE Main scores, some have their own entrance exams. The process typically includes: application → entrance exam → counseling → admission.'
    },
    {
      question: 'Can I pursue B.Tech through distance education?',
      answer: 'Yes, many universities offer B.Tech through distance learning and online modes, providing flexibility for working professionals.'
    },
    {
      question: 'What are the specializations available in B.Tech?',
      answer: 'Popular specializations include Computer Science, Mechanical Engineering, Electrical Engineering, Civil Engineering, Electronics & Communication, and Information Technology.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <svg 
                    className={`w-5 h-5 transform transition-transform duration-200 ${
                      activeIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                    />
                  </svg>
                </div>
              </button>
              
              {activeIndex === index && (
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ