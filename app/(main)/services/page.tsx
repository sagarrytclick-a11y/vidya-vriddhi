import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, GraduationCap, Users, BookOpen, Award, Globe, Briefcase, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Services | College Counseling, Admissions & Study Abroad',
  description: 'Explore VidyaVriddhi services — college counseling, admission support, test preparation, scholarship assistance, study abroad programs, and career guidance.',
  openGraph: {
    title: 'VidyaVriddhi Services - Educational Guidance & Support',
    description: 'Comprehensive educational services including college counseling, test prep, and career guidance.',
  },
}

const ServicesPage = () => {
  const services = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "College Counseling",
      description: "Expert guidance to help you choose the right college and course based on your interests and career goals.",
      features: [
        "Personalized counseling sessions",
        "College selection assistance",
        "Application process guidance",
        "Career path planning"
      ],
      link: "/counseling"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Admission Support",
      description: "Complete end-to-end support for college admissions, from form filling to document preparation.",
      features: [
        "Application form assistance",
        "Document verification",
        "Deadline tracking",
        "Follow-up with colleges"
      ],
      link: "/admissions"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Test Preparation",
      description: "Comprehensive preparation for entrance exams with expert faculty and proven study materials.",
      features: [
        "Mock tests and assessments",
        "Study materials and resources",
        "Performance analysis",
        "Doubt clearing sessions"
      ],
      link: "/test-prep"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Scholarship Assistance",
      description: "Help you find and apply for scholarships to reduce the financial burden of education.",
      features: [
        "Scholarship database access",
        "Application guidance",
        "Essay writing support",
        "Financial aid counseling"
      ],
      link: "/scholarships"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Study Abroad Programs",
      description: "Complete support for international education, from country selection to visa assistance.",
      features: [
        "Country and university selection",
        "Visa application support",
        "Pre-departure orientation",
        "Accommodation assistance"
      ],
      link: "/study-abroad"
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Career Guidance",
      description: "Professional career counseling to help you make informed decisions about your future.",
      features: [
        "Career assessment tests",
        "Industry insights",
        "Skill development programs",
        "Job placement assistance"
      ],
      link: "/career-guidance"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <GraduationCap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Our Services</h1>
              <p className="text-gray-600">Comprehensive educational solutions for your success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Empowering Your <span className="text-orange-500">Educational Journey</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive services designed to support students at every step of their academic and career path. From college selection to career guidance, we're here to help you succeed.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">50,000+</div>
                <p className="text-gray-600">Students Guided</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                <p className="text-gray-600">Partner Colleges</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">95%</div>
                <p className="text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">15+</div>
                <p className="text-gray-600">Years Experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <div className="text-orange-500">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={service.link}
                  className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
                <p className="text-gray-600 text-sm">Initial assessment to understand your goals and preferences</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                <p className="text-gray-600 text-sm">Create a personalized roadmap for your educational journey</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Execution</h3>
                <p className="text-gray-600 text-sm">Implement the plan with our expert guidance and support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Success</h3>
                <p className="text-gray-600 text-sm">Achieve your educational and career goals with confidence</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Start Your Journey Today</h2>
              <p className="mb-6 opacity-90">
                Join thousands of students who have achieved their dreams with our guidance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-50 transition-colors font-bold"
                >
                  Get Free Counseling
                </Link>
                <Link 
                  href="/register"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-bold border border-white"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How much do your services cost?</h3>
                <p className="text-gray-600 text-sm">
                  Basic services like college search are free. Premium counseling has nominal charges. Contact us for detailed pricing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you guarantee admission?</h3>
                <p className="text-gray-600 text-sm">
                  We provide expert guidance and improve your chances, but admission depends on merit and college criteria.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get online counseling?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we offer both in-person and online counseling sessions to accommodate students from all locations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I get started?</h3>
                <p className="text-gray-600 text-sm">
                  Simply create a free account or contact us directly. Our team will guide you through the process step by step.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ServicesPage