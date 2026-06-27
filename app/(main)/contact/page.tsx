import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, Clock, GraduationCap, Users, Award, Target, BookOpen, Globe } from 'lucide-react'
import { SITE_IDENTITY, getFullAddress } from '../site-identity'

export const metadata: Metadata = {
  title: 'Contact Us | VidyaVriddhi',
  description: 'Get in touch with VidyaVriddhi for college admissions, career counseling, exam guidance, and study abroad support. Call, email, or visit our office.',
  openGraph: {
    title: 'Contact VidyaVriddhi - Education Counseling & Admissions',
    description: 'Reach out to VidyaVriddhi for personalized educational guidance and admission support.',
  },
}

const ContactPage = () => {
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
              <MessageSquare className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact {SITE_IDENTITY.name}</h1>
              <p className="text-gray-600">{SITE_IDENTITY.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{SITE_IDENTITY.contact.email.support}</p>
                    <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{SITE_IDENTITY.contact.phone.display}</p>
                    <p className="text-gray-500 text-sm">Mon-Sat, 9 AM - 6 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">{SITE_IDENTITY.contact.address.city}</p>
                    <p className="text-gray-500 text-sm">{SITE_IDENTITY.contact.address.country}</p>
                  </div>
                </div>
              </div>
              
              {/* Office Hours */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-1 text-gray-600 text-sm">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="admission">Admission Guidance</option>
                    <option value="counseling">Career Counseling</option>
                    <option value="colleges">College Information</option>
                    <option value="exams">Exam Preparation</option>
                    <option value="study-abroad">Study Abroad</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    Send me educational updates and newsletters
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About {SITE_IDENTITY.name}</h2>
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
        </div>

        {/* Office & Contact Details Section */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Office Photo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src="/about/image-4.jpg"
                  alt="{SITE_IDENTITY.name} Office"
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
                  Located in the heart of {SITE_IDENTITY.contact.address.city}, our modern office serves as the central hub 
                  where our expert counselors work tirelessly to guide students toward their academic dreams. 
                  The welcoming environment reflects our commitment to making every student feel supported 
                  throughout their educational journey.
                </p>
                <div className="text-sm text-gray-500">
                  <p><strong>Address:</strong> {getFullAddress()}</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Get in Touch</h3>
                <p className="text-orange-500 font-medium mb-4">{SITE_IDENTITY.tagline}</p>
                <p className="text-gray-600 mb-6">
                  Ready to take the first step toward your dream university? Contact us for a 
                  personalized counseling session. Whether you are a student, parent, or educational 
                  institution, we are here to guide you every step of the way.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">{SITE_IDENTITY.contact.email.support}</p>
                      <p className="text-gray-500 text-sm">{SITE_IDENTITY.contact.email.admissions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">{SITE_IDENTITY.contact.phone.display}</p>
                      {SITE_IDENTITY.contact.phone.additional && (
                        <p className="text-gray-500 text-sm">{SITE_IDENTITY.contact.phone.additional.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">{getFullAddress()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How quickly will you respond?</h3>
                <p className="text-gray-600 text-sm">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you charge for counseling?</h3>
                <p className="text-gray-600 text-sm">
                  Basic information and college search are free. Premium counseling services have nominal charges. Contact us for details.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I visit your office?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! We welcome students and parents to visit our office. Please schedule an appointment in advance for personalized counseling.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer online counseling?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we provide online counseling through video calls for students who cannot visit our office in person.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage