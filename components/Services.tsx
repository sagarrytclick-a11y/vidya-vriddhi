'use client'

import React from 'react'
import { GraduationCap, Users, BookOpen, Award, Globe, Briefcase, ChevronRight } from 'lucide-react'

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
            <ChevronRight className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Services: React.FC = () => {
  const services = [
    {
      icon: <GraduationCap className="w-6 h-6 text-orange-500" />,
      title: "College Counseling",
      description: "Expert guidance to help you choose the right college and course based on your interests and career goals.",
      features: [
        "Personalized counseling sessions",
        "College selection assistance",
        "Application process guidance",
        "Career path planning"
      ]
    },
    {
      icon: <Users className="w-6 h-6 text-orange-500" />,
      title: "Admission Support",
      description: "Complete end-to-end support for college admissions, from form filling to document preparation.",
      features: [
        "Application form assistance",
        "Document verification",
        "Deadline tracking",
        "Follow-up with colleges"
      ]
    },
    {
      icon: <BookOpen className="w-6 h-6 text-orange-500" />,
      title: "Test Preparation",
      description: "Comprehensive preparation for entrance exams with expert faculty and proven study materials.",
      features: [
        "Mock tests and assessments",
        "Study materials and resources",
        "Performance analysis",
        "Doubt clearing sessions"
      ]
    },
    {
      icon: <Award className="w-6 h-6 text-orange-500" />,
      title: "Scholarship Assistance",
      description: "Help you find and apply for scholarships to reduce the financial burden of education.",
      features: [
        "Scholarship database access",
        "Application guidance",
        "Essay writing support",
        "Financial aid counseling"
      ]
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-500" />,
      title: "Study Abroad Programs",
      description: "Complete support for international education, from country selection to visa assistance.",
      features: [
        "Country and university selection",
        "Visa application support",
        "Pre-departure orientation",
        "Accommodation assistance"
      ]
    },
    {
      icon: <Briefcase className="w-6 h-6 text-orange-500" />,
      title: "Career Guidance",
      description: "Professional career counseling to help you make informed decisions about your future.",
      features: [
        "Career assessment tests",
        "Industry insights",
        "Skill development programs",
        "Job placement assistance"
      ]
    }
  ]

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive educational services to help students achieve their academic and career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            <span>Explore All Services</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Services
