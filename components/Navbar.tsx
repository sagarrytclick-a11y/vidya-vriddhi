'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

 const mainNavItems = [
    {
        name : "All colleges",
        hasDropdown: true,
        dropdownContent: {
            colleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore'],
            exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE'],
            predictors: ['JEE Main Rank Predictor', 'JEE Advanced Predictor', 'COMEDK Predictor'],
            viewAllLink: 'View all Engineering colleges',
        },
    },
    {
      name: 'Engineering',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore'],
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE'],
        predictors: ['JEE Main Rank Predictor', 'JEE Advanced Predictor', 'COMEDK Predictor'],
        viewAllLink: 'View all Engineering colleges',
      },
    },
    {
      name: 'Management',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'XLRI Jamshedpur', 'FMS Delhi', 'SPJIMR Mumbai'],
        exams: ['CAT', 'XAT', 'MAT', 'SNAP', 'NMAT', 'CMAT'],
        predictors: ['CAT Percentile Predictor', 'XAT Percentile Predictor', 'IIM Call Predictor'],
        viewAllLink: 'View all Management colleges',
      },
    },
    {
      name: 'Medical',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['AIIMS Delhi', 'CMC Vellore', 'JIPMER Puducherry', 'KGMU Lucknow', 'MAMC Delhi'],
        exams: ['NEET UG', 'NEET PG', 'INI CET', 'FMGE'],
        predictors: ['NEET College Predictor', 'NEET PG Rank Predictor'],
        viewAllLink: 'View all Medical colleges',
      },
    },
    {
      name: 'Commerce',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['SRCC Delhi', 'LSR Delhi', 'Hindu College', 'St. Xavier\'s Mumbai', 'Loyola College'],
        exams: ['CUET', 'IPMAT', 'NPAT', 'SET'],
        predictors: ['CUET College Predictor', 'DU Admission Predictor'],
        viewAllLink: 'View all Commerce colleges',
      },
    },
    {
      name: 'Law',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'WBNUJS Kolkata', 'NLU Delhi', 'Symbiosis Law'],
        exams: ['CLAT', 'AILET', 'LSAT India', 'MH CET Law'],
        predictors: ['CLAT Rank Predictor', 'AILET Predictor'],
        viewAllLink: 'View all Law colleges',
      },
    },
    {
      name: 'Science',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['IISc Bangalore', 'IISER Pune', 'St. Stephen\'s Delhi', 'Miranda House', 'Madras Christian College'],
        exams: ['NEST', 'IAT (IISER)', 'CUET UG', 'IIT JAM'],
        predictors: ['IISER Admission Predictor', 'CUET Science Predictor'],
        viewAllLink: 'View all Science colleges',
      },
    },
    {
      name: 'Design',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['NID Ahmedabad', 'NIFT Delhi', 'IIT Bombay (IDC)', 'Pearl Academy', 'Srishti Manipal'],
        exams: ['UCEED', 'CEED', 'NID DAT', 'NIFT Entrance'],
        predictors: ['NIFT Rank Predictor', 'UCEED College Predictor'],
        viewAllLink: 'View all Design colleges',
      },
    },
  ]

  return (
    <div className="w-full shadow-sm">
      {/* Top Navbar: VidyaVriddhi Blue/Dark Theme */}
      <nav className="bg-slate-900 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
             <div className="bg-white p-1.5 rounded-lg">
                <Image src={'/logo.png'} height={100} width={100} alt="VidyaVriddhi Logo" />
             </div>
          </div>

          <Link href="/login">
            <button className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm">
              <User size={16} />
              <span>Admin Login</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Secondary Navigation: Dropdowns logic fixed here */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
          {mainNavItems.map((item) => (
            <div
              key={item.name}
              className="relative py-4 group" // Relative parent is CRUCIAL
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {/* Trigger Button */}
              <button 
                className={`flex items-center space-x-1 text-sm font-semibold transition-colors outline-none ${
                  activeDropdown === item.name ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                <span>{item.name}</span>
                {item.hasDropdown && (
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                )}
              </button>
              
              {/* Fixed Dropdown: Absolute positioning */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[550px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-6 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="grid grid-cols-3 gap-8">
                    {/* Columns logic inside grid */}
                    {item.dropdownContent.colleges && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest border-b border-slate-50 pb-2">Top Colleges</h3>
                        <ul className="space-y-2">
                          {item.dropdownContent.colleges.map((college, i) => (
                            <li key={i} className="text-sm text-gray-500 hover:text-orange-500 cursor-pointer transition-colors leading-tight">
                              {college}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.dropdownContent.exams && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest border-b border-slate-50 pb-2">Exams</h3>
                        <ul className="space-y-2">
                          {item.dropdownContent.exams.map((exam, i) => (
                            <li key={i} className="text-sm text-gray-500 hover:text-orange-500 cursor-pointer transition-colors leading-tight">
                              {exam}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.dropdownContent.predictors && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest border-b border-slate-50 pb-2">Predictors</h3>
                        <ul className="space-y-2">
                          {item.dropdownContent.predictors.map((pred, i) => (
                            <li key={i} className="text-sm text-gray-500 hover:text-orange-500 cursor-pointer transition-colors leading-tight">
                              {pred}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* View All Footer */}
                  {item.dropdownContent.viewAllLink && (
                    <div className="mt-6 pt-4 border-t border-gray-50">
                      <button className="flex items-center text-orange-500 font-bold text-xs hover:gap-2 transition-all">
                        {item.dropdownContent.viewAllLink}
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar