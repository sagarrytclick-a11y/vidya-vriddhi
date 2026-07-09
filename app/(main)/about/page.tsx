import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, GraduationCap, Users, Award, Target, BookOpen, MapPin, Phone, Mail, Globe, Quote, Sparkles, Building2 } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-orange-400 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-orange-500 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">About {SITE_IDENTITY.name}</h1>
              <p className="text-lg text-white/70 max-w-2xl">{SITE_IDENTITY.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* What We Do */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4 border border-orange-200">
              Our Mission
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Do</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              At {SITE_IDENTITY.name}, we provide comprehensive career counseling and admission guidance
              to help students secure placements at their dream universities across India and abroad.
              Our expert counselors work closely with each student to understand their aspirations,
              analyze their strengths, and craft personalized pathways to academic success.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Personalized Counseling', desc: 'One-on-one guidance tailored to your academic profile, interests, and career goals' },
              { icon: Globe, title: 'Nationwide Reach', desc: 'Connecting students with top universities across the country and international institutions' },
              { icon: Award, title: 'Proven Results', desc: '95% success rate in helping students secure admissions to their preferred institutions' },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-slate-200">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The {SITE_IDENTITY.name} Story</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  {SITE_IDENTITY.name} was born from a powerful realization: every student deserves access
                  to expert guidance that can transform their educational aspirations into reality.
                  Founded in {SITE_IDENTITY.business.established} by our visionary founder, our organization emerged from the urgent need
                  to bridge the gap between talented students and their dream institutions.
                </p>
                <p>
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
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder & Office */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100/50 transition-shadow duration-300">
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative w-32 h-48 sm:w-40 sm:h-60 rounded-xl overflow-hidden shadow-lg shrink-0">
                    <Image
                      src="/about/founder.png"
                      alt="Abhishek Tiwari - Founder & CEO"
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shrink-0">
                        AT
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Abhishek Tiwari</h3>
                        <p className="text-orange-500 font-medium text-sm">Founder & Chief Executive Officer</p>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      With extensive experience in education and career counseling, our founder
                      established {SITE_IDENTITY.name} with a vision to democratize access to quality higher education.
                      Their passion for mentoring young minds has helped thousands of students find their
                      path to success at premier institutions across the nation.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {SITE_IDENTITY.contact.email.general}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100/50 transition-shadow duration-300">
              <div className="relative h-56 w-full">
                <Image
                  src="/about/image-4.jpg"
                  alt="Vidya Vriddhi Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Our Headquarters</h3>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                  Located in the heart of Noida, our modern office serves as the central hub
                  where our expert counselors work tirelessly to guide students toward their academic dreams.
                  The welcoming environment reflects our commitment to making every student feel supported
                  throughout their educational journey.
                </p>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <strong className="text-slate-900">Address:</strong> {getFullAddress()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4 border border-orange-200">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every student we counsel.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: 'Student-First', desc: 'Every recommendation prioritizes the student\'s best interests and long-term success', color: 'blue' },
              { icon: Award, title: 'Unwavering Integrity', desc: 'Transparent, honest guidance with no hidden agendas', color: 'green' },
              { icon: BookOpen, title: 'Continuous Innovation', desc: 'Leveraging the latest tools to deliver cutting-edge counseling', color: 'purple' },
              { icon: Target, title: 'Results-Driven', desc: 'Focused on measurable outcomes — admissions secured and dreams achieved', color: 'orange' },
            ].map((item, i) => {
              const colors = {
                blue: 'from-blue-50 to-blue-100 text-blue-600',
                green: 'from-green-50 to-green-100 text-green-600',
                purple: 'from-purple-50 to-purple-100 text-purple-600',
                orange: 'from-orange-50 to-orange-100 text-orange-600',
              }
              return (
                <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[item.color as keyof typeof colors]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-60 h-60 rounded-full bg-orange-400 blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-orange-400 blur-3xl" />
            </div>
            <div className="relative text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Impact</h2>
              <p className="text-white/60 max-w-xl mx-auto">Numbers that reflect our commitment to educational excellence</p>
            </div>
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '50,000+', label: 'Students Guided', color: 'from-orange-400 to-amber-500' },
                { number: '500+', label: 'Partner Institutions', color: 'from-blue-400 to-cyan-500' },
                { number: '95%', label: 'Admission Success', color: 'from-green-400 to-emerald-500' },
                { number: '4.9/5', label: 'Student Rating', color: 'from-purple-400 to-pink-500' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>
                  <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 md:p-12 border border-orange-100">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="w-10 h-10 text-orange-300 mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl text-slate-800 font-medium leading-relaxed mb-6">
                &ldquo;{SITE_IDENTITY.name} didn&apos;t just help me get into a good college — they helped me discover
                the career path I was truly meant to follow. Their counselors took the time to understand
                my strengths and guided me every step of the way.&rdquo;
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  RS
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Rahul Sharma</p>
                  <p className="text-sm text-slate-500">MBA, IIM Ahmedabad (Batch 2025)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4 border border-orange-200">
                  Get in Touch
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ready to Start Your Journey?</h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Visit our office for a personalized counseling session. Whether you are a student, parent,
                  or educational institution, we are here to guide you every step of the way.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-900">{SITE_IDENTITY.contact.phone.display}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-semibold text-slate-900">{SITE_IDENTITY.contact.email.support}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-semibold text-slate-900">{getFullAddress()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  Office Hours
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Monday - Saturday</span>
                    <span className="font-semibold text-slate-900">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Sunday</span>
                    <span className="font-semibold text-slate-900">10:00 AM - 2:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-500">Sunday: Online consultations only</p>
                  <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-orange-700 font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Walk-ins welcome! No appointment needed.
                    </p>
                  </div>
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
