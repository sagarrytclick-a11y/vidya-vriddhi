'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [openItems, setOpenItems] = useState<number[]>([])

  const categories = ['All', 'Admissions', 'Colleges', 'Exams', 'Courses', 'Study Abroad']

  const faqData: FAQItem[] = [
    {
      question: "How do I apply for colleges through Vidya Vridhi?",
      answer: "You can apply for colleges through our platform by creating an account, filling out your profile, and using our college search tool to find suitable institutions. Once you've selected colleges, you can submit applications directly through our portal.",
      category: "Admissions"
    },
    {
      question: "What is the college predictor tool?",
      answer: "Our college predictor tool uses your exam scores, category, and preferences to predict your chances of admission to various colleges. It analyzes previous year cutoffs and admission trends to provide accurate predictions.",
      category: "Colleges"
    },
    {
      question: "How accurate are the college rankings?",
      answer: "Our college rankings are based on comprehensive research including NIRF rankings, placement records, faculty quality, infrastructure, and student reviews. We update rankings annually to ensure accuracy.",
      category: "Colleges"
    },
    {
      question: "What entrance exams do you cover?",
      answer: "We cover all major entrance exams including JEE Main/Advanced, NEET, CAT, MAT, XAT, CLAT, CUET, GATE, and various state-level entrance tests for engineering, medical, management, and law programs.",
      category: "Exams"
    },
    {
      question: "How can I prepare for entrance exams?",
      answer: "We offer comprehensive exam preparation resources including study materials, mock tests, previous year papers, expert guidance, and personalized study plans to help you excel in your entrance exams.",
      category: "Exams"
    },
    {
      question: "What courses are available for different streams?",
      answer: "We offer information on courses across all streams including Engineering (B.Tech/M.Tech), Medical (MBBS/MD/MS), Management (BBA/MBA), Commerce (B.Com/M.Com), Arts (BA/MA), Science (B.Sc/M.Sc), and professional courses.",
      category: "Courses"
    },
    {
      question: "How do I choose the right course?",
      answer: "Our career counselors help you choose the right course based on your interests, aptitude, academic performance, and career goals. We also provide detailed course information and career prospects.",
      category: "Courses"
    },
    {
      question: "What support do you provide for study abroad?",
      answer: "We provide complete study abroad support including country selection, university shortlisting, application assistance, visa guidance, scholarship help, and pre-departure orientation.",
      category: "Study Abroad"
    },
    {
      question: "How do I get scholarships?",
      answer: "We help you find and apply for scholarships based on your academic performance, financial need, and category. Our database includes government, private, and institutional scholarships.",
      category: "Admissions"
    },
    {
      question: "Is the consultation service free?",
      answer: "Basic college search and information access is free. Premium services including personalized counseling, application assistance, and study abroad guidance have nominal charges.",
      category: "Admissions"
    }
  ]

  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory)

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-50 rounded-full">
              <HelpCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about colleges, admissions, exams, and career guidance
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openItems.includes(index)
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our expert counselors are here to help you with any queries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Contact Counselor
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Browse Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
