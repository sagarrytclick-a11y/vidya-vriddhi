'use client'

import CourseCategories from "./CourseCategories"
import CourseGrid from "./CourseGrid"
import EmploymentPartners from "./EmploymentPartners"
import Onlinehero from "./Onlinehero"
import StatisticsSection from "./StatisticsSection"
import Swiper from "./Swiper"
import WhatWeOfferSection from "./WhatWeOfferSection"



export default function OnlineMBAComponent() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Onlinehero    />
      {/* Online MBA Counseling Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-400 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-400 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/10">
            Expert Guidance Available
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Need Help With Your<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Online MBA</span> Admission?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Get one-on-one counseling, compare top universities, check eligibility & find the perfect Online MBA program for your career.
          </p>
          <a
            href="https://youronlinemba.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold text-lg shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300"
          >
            Visit youronlinemba.in
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/50 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Free Counseling
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              University Comparison
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Eligibility Check
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Expert Support
            </span>
          </div>
        </div>
      </section>
      <StatisticsSection />
      <Swiper />
      <EmploymentPartners />
      <WhatWeOfferSection />
      <CourseGrid />
      <CourseCategories />
    </div>
  )
}