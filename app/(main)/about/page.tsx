import React from 'react'
import Link from 'next/link'
import { ArrowLeft, GraduationCap, Users, Award, Target, BookOpen } from 'lucide-react'

const AboutPage = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">About Vidya Vridhi</h1>
              <p className="text-gray-600">Empowering students to achieve their educational dreams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mission Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To democratize access to quality education by providing comprehensive, accurate, and personalized guidance to students at every step of their academic journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-gray-600 text-sm">Making educational resources accessible to every student regardless of their background</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                <p className="text-gray-600 text-sm">Tailored guidance based on individual student profiles and aspirations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">Maintaining highest standards of accuracy and reliability in all information</p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Vidya Vridhi was born from a simple observation: millions of Indian students struggle with making informed educational decisions due to lack of reliable, comprehensive information and personalized guidance.
              </p>
              <p className="mb-4">
                Founded in 2020 by a team of education enthusiasts and technology experts, Vidya Vridhi started as a small initiative to help students navigate the complex landscape of Indian education. Today, we've grown into one of India's most trusted educational platforms, serving over 50,000 students across the country.
              </p>
              <p>
                Our journey has been driven by countless success stories - students who found their dream colleges, secured admissions to prestigious institutions, and embarked on fulfilling careers with our guidance. These stories fuel our passion to continuously innovate and improve our services.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Student-First Approach</h3>
                  <p className="text-gray-600">Every decision we make is guided by what's best for our students' future</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
                  <p className="text-gray-600">We maintain complete transparency and honesty in all our interactions</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">Continuously evolving our platform to serve students better</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Empathy</h3>
                  <p className="text-gray-600">Understanding and addressing the unique challenges each student faces</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50,000+</div>
                <p className="text-orange-100">Students Guided</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="text-orange-100">Partner Colleges</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <p className="text-orange-100">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <p className="text-orange-100">User Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900">Dr. Rajesh Kumar</h3>
                <p className="text-gray-600 text-sm mb-2">Founder & CEO</p>
                <p className="text-gray-500 text-xs">20+ years in education technology</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900">Priya Sharma</h3>
                <p className="text-gray-600 text-sm mb-2">Co-Founder & COO</p>
                <p className="text-gray-500 text-xs">Expert in student counseling</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold text-gray-900">Amit Patel</h3>
                <p className="text-gray-600 text-sm mb-2">CTO</p>
                <p className="text-gray-500 text-xs">15+ years in tech innovation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-700 mb-6">
              We'd love to hear from you! Whether you're a student, parent, or educational institution, we're here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> info@vidyavridhi.com</p>
                  <p><strong>Phone:</strong> +91 80123 45678</p>
                  <p><strong>Address:</strong> Bangalore, Karnataka, India</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage