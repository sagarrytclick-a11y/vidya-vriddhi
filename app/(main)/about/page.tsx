import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, GraduationCap, Users, Award, Target, BookOpen, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { SITE_IDENTITY, getFullAddress } from '../site-identity'

export const metadata: Metadata = {
  title: 'About Us | VidyaVriddhi',
  description: 'Learn about VidyaVriddhi — our mission to help students find top colleges, get career counseling, exam guidance, and admission support across India and abroad.',
  openGraph: {
    title: 'About VidyaVriddhi - College Guidance & Career Counseling',
    description: 'Comprehensive education services helping students secure admissions to their dream universities across India and abroad.',
  },
}

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
              <h1 className="text-2xl font-bold text-gray-900">About {SITE_IDENTITY.name}</h1>
              <p className="text-gray-600">{SITE_IDENTITY.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* What We Do Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
              <p className="text-lg md:text-xl text-orange-100 max-w-4xl mx-auto leading-relaxed">
                At {SITE_IDENTITY.name}, we provide comprehensive career counseling and admission guidance 
                to help students secure placements at their dream universities across India and abroad. 
                Our expert counselors work closely with each student to understand their aspirations, 
                analyze their strengths, and craft personalized pathways to academic success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Personalized Counseling</h3>
                <p className="text-orange-100 text-sm">
                  One-on-one guidance tailored to your academic profile, interests, and career goals
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Nationwide Reach</h3>
                <p className="text-orange-100 text-sm">
                  Connecting students with top universities across the country and international institutions
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Proven Results</h3>
                <p className="text-orange-100 text-sm">
                  95% success rate in helping students secure admissions to their preferred institutions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Office & Founder Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Office Photo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="/about/image-4.jpg"
                  alt="Vidya Vriddhi Office"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-900">Our Headquarters</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Located in the heart of Noida, our modern office serves as the central hub 
                  where our expert counselors work tirelessly to guide students toward their academic dreams. 
                  The welcoming environment reflects our commitment to making every student feel supported 
                  throughout their educational journey.
                </p>
                <div className="text-sm text-gray-500">
                  <p><strong>Address:</strong> {getFullAddress()}</p>
                </div>
              </div>
            </div>

            {/* Founder Photo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="/about/founder.png"
                  alt="Abhishek Tiwari - Founder & CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{SITE_IDENTITY.meta.author}</h3>
                <p className="text-orange-500 font-medium mb-3">Founder & Chief Executive Officer</p>
                <p className="text-gray-600 mb-4">
                  With extensive experience in education and career counseling, our founder 
                  established {SITE_IDENTITY.name} with a vision to democratize access to quality higher education. 
                  Their passion for mentoring young minds has helped thousands of students find their 
                  path to success at premier institutions across the nation.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{SITE_IDENTITY.contact.email.general}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                {SITE_IDENTITY.name} was born from a powerful realization: every student deserves access 
                to expert guidance that can transform their educational aspirations into reality. 
                Founded in {SITE_IDENTITY.business.established} by our visionary founder, our organization emerged from the urgent need 
                to bridge the gap between talented students and their dream institutions.
              </p>
              <p className="mb-4">
                What started as a small counseling center in Noida has grown into a nationally 
                recognized educational consultancy. We have successfully guided over 50,000 students 
                through the complex admission processes of India's top universities and international 
                institutions. Our comprehensive services include career assessment, college selection, 
                application assistance, interview preparation, and scholarship guidance.
              </p>
              <p>
                Our team of certified counselors combines deep industry knowledge with genuine empathy 
                for each student's unique situation. We understand that choosing the right educational 
                path is one of life's most significant decisions, and we take that responsibility seriously. 
                Every success story - from a student securing admission to IIT to another winning a 
                scholarship at a prestigious international university - fuels our commitment to excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Student-First Philosophy</h3>
                  <p className="text-gray-600">Every recommendation we make prioritizes the student's best interests and long-term success</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Unwavering Integrity</h3>
                  <p className="text-gray-600">Transparent, honest guidance with no hidden agendas or misleading promises</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Continuous Innovation</h3>
                  <p className="text-gray-600">Leveraging the latest tools and methodologies to deliver cutting-edge counseling</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Results-Driven Approach</h3>
                  <p className="text-gray-600">Focused on measurable outcomes - admissions secured and dreams achieved</p>
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
                <p className="text-orange-100">Partner Institutions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <p className="text-orange-100">Admission Success</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <p className="text-orange-100">Student Rating</p>
              </div>
            </div>
          </div>
        </section>

        

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
            <p className="text-gray-700 mb-6">
              Ready to take the first step toward your dream university? Visit our office for a 
              personalized counseling session. Whether you are a student, parent, or educational 
              institution, we are here to guide you every step of the way.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> {SITE_IDENTITY.contact.email.support}</p>
                  <p><strong>Phone:</strong> {SITE_IDENTITY.contact.phone.display}</p>
                  {SITE_IDENTITY.contact.phone.additional && (
                    <p><strong>Additional:</strong> {SITE_IDENTITY.contact.phone.additional.join(', ')}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>Office Hours</span>
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Monday - Saturday:</strong> 9:00 AM - 7:00 PM</p>
                  <p><strong>Sunday:</strong> 10:00 AM - 2:00 PM (Online Only)</p>
                  <p className="text-orange-500 font-medium">Walk-ins welcome!</p>
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
