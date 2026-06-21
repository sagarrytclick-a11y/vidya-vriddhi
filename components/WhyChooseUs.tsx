'use client'

import React from 'react'
import { CheckCircle, Users, Award, Clock, Headphones, TrendingUp } from 'lucide-react'
import { useAdmissionModal } from '@/contexts/admission-modal-context'

interface FeatureProps {
  icon: React.ReactNode
  title: string
  description: string
  stats?: string
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, stats }) => {
  return (
    <div className="text-center group">
      <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base mb-3">{description}</p>
      {stats && (
        <div className="text-xl sm:text-2xl font-bold text-orange-500">{stats}</div>
      )}
    </div>
  )
}

const WhyChooseUs: React.FC = () => {
  const { openModal } = useAdmissionModal()
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-orange-500" />,
      title: "Expert Guidance",
      description: "Professional counselors with years of experience in education consulting",
      stats: "15+ Years"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Success Stories",
      description: "Thousands of students placed in top colleges and universities worldwide",
      stats: "50,000+ Students"
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: "Top Partnerships",
      description: "Collaborations with leading universities and educational institutions",
      stats: "500+ Partners"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your educational queries and needs",
      stats: "Always Available"
    },
    {
      icon: <Headphones className="w-8 h-8 text-orange-500" />,
      title: "Personalized Approach",
      description: "Tailored solutions based on individual student profiles and goals",
      stats: "100% Customized"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: "High Success Rate",
      description: "Proven track record of successful admissions and career placements",
      stats: "95% Success Rate"
    }
  ]

  const highlights = [
    "Free career counseling sessions",
    "Expert visa guidance for study abroad",
    "Scholarship and financial aid assistance",
    "Comprehensive test preparation",
    "End-to-end admission support",
    "Post-admission guidance"
  ]

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Vidya Vridhi</h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We are committed to helping students achieve their educational dreams with our comprehensive and personalized approach
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>

        {/* Highlights Section */}
        <div className="bg-linear-to-r from-orange-50 to-orange-100 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">What Makes Us Different</h3>
            <p className="text-gray-600">Comprehensive services designed for your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-900 text-white rounded-2xl p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Join thousands of successful students who have transformed their careers with our guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openModal()} className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Get Free Counseling
              </button>
              <button onClick={() => openModal()} className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs