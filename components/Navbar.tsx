'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, User, ArrowRight, Search, Menu, X, LogOut, PencilLine, Bot, Sparkles, Target } from 'lucide-react'
import SearchOverlay from './SearchOverlay'
import { useAdmissionModal } from '@/contexts/admission-modal-context'
import { useVVSaarthi } from '@/contexts/vv-saarthi-context'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'

const Navbar = () => {
  const { user, isSignedIn } = useUser()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openModal } = useAdmissionModal()
  const { toggle: toggleSaarthi } = useVVSaarthi()

  useEffect(() => {
    const handleScroll = () => {
      // Show search bar after scrolling past hero section (approx 500px)
      setShowSearchBar(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getViewAllHref = (name: string) => {
    const map: Record<string, string> = {
      'All colleges': '/colleges',
      'Engineering': '/colleges?category=engineering',
      'Management': '/colleges?category=management',
      'Medical': '/colleges?category=medical',
      'Commerce': '/colleges?category=commerce',
      'B.Tech': '/btech',
      'Online MBA': '/online-mba',
    }
    return map[name] || '/colleges'
  }

  const getSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const mainNavItems = [
    {
      name: "All colleges",
      hasDropdown: true,
      dropdownContent: {
        colleges: ['Indian Institute of Technology Delhi (IIT Delhi)', 'Xavier School of Management', 'Lady Shri Ram College for Women (LSR), Delhi', 'Christian Medical College (CMC)', 'Maulana Azad Medical College (MAMC), Delhi', 'Hansraj College, Delhi', 'St. Stephens College, Delhi', 'Vardhman Mahavir Medical College (VMMC)', 'Vellore Institute of Technology (VIT)'],
        viewAllLink: 'View all Engineering colleges',
      },
    },
    {
      name: 'Engineering',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['National Law School of India University, Bangalore', 'Indian Institute of Technology Delhi (IIT Delhi)', 'Indian Institute of Technology Bombay (IITB)', 'Vellore Institute of Technology (VIT)', 'SRM Institute of Science and Technology (SRMIST)', 'Birla Institute of Technology and Science (BITS), Pilani', 'Thapar Institute of Engineering and Technology (TIET)' , 'Delhi Technological University (DTU), Delhi'],
        viewAllLink: 'View all Engineering colleges',
      },
    },
    {
      name: 'Management',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['IIM Ahmedabad (Indian Institute of Management)', 'Indian Institute of Management Calcutta (IIMC)', 'Indian Institute of Management Bangalore', 'Indian Institute of Technology Bombay (IITB)', 'The Institute of Hotel Management, Bangalore', 'Faculty of Management Studies, University of Delhi (FMS Delhi)' , 'Xavier School of Management (XLRI), Jamshedpur', 'Indian Institute of Foreign Trade (IIFT), Delhi' , 'Xavier School of Management' , 'SRM Institute of Science and Technology (SRMIST)' , 'Symbiosis Institute of Business Management (SIBM)'],
        viewAllLink: 'View all Management colleges',
      },
    },
    {
      name: 'Medical',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['Maulana Azad Medical College (MAMC)', 'All India Institute of Medical Sciences (AIIMS)', 'Maulana Azad Medical College (MAMC), Delhi', 'Christian Medical College (CMC)', 'Kasturba Medical College (KMC), Manipal' , 'Grant Government Medical College & Sir J.J. Group of Hospitals (GMC Mumbai)' , 'King Georges Medical University (KGMU), Lucknow' , 'SRM Institute of Science and Technology (SRMIST)' , 'St. Johns Medical College' , 'Vardhman Mahavir Medical College (VMMC)' ],
        viewAllLink: 'View all Medical colleges',
      },
    },
    {
      name: 'Commerce',
      hasDropdown: true,
      dropdownContent: {
        colleges: ['Miranda House, Delhi', 'Shri Ram College of Commerce (SRCC)', 'Indian Institute of Management Bangalore', 'Loyola College, Chennai', 'Lady Shri Ram College for Women (LSR), Delhi' , 'Vellore Institute of Technology (VIT)' , 'Hansraj College, Delhi' , 'SRM Institute of Science and Technology (SRMIST)' , 'St. Stephens College, Delhi'],
        viewAllLink: 'View all Commerce colleges',
      },
      
    },
    {
      name: 'B.Tech',
      href: '/btech',
    },
    {
      name: 'Online MBA',
      href: '/online-mba',
    },
    {
      name: 'NEET Rank Predictor',
      href: '/neet-rank-predictor',
    },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] w-full shadow-sm">
        {/* Top Navbar: VidyaVriddhi Blue/Dark Theme */}
        <nav className="bg-slate-900 px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="bg-white p-1 rounded-lg sm:p-1.5">
                <Image src={'/logo.png'} height={80} width={80} alt="VidyaVriddhi Logo" className="h-7 w-auto sm:h-10" />
              </Link>
            </div>


            {/* Desktop Search Bar - appears on scroll */}
            <div className={`hidden cursor-pointer lg:flex items-center transition-all duration-300 ${showSearchBar ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center cursor-pointer space-x-3 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2.5 rounded-lg transition-all mr-3 w-96 xl:w-125"
              >
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Search colleges, exams...</span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex cursor-pointer items-center space-x-2 sm:space-x-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden lg:flex items-center space-x-3 ml-6">
                <Link
                  href="/neet-rank-predictor"
                  className="text-white hover:text-orange-300 px-2.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/20 text-orange-400">
                    <Target className="w-3.5 h-3.5" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm">NEET Predictor</p>
                    <p className="bg-orange-500 text-[9px] leading-none inline-flex items-center justify-center px-1.5 py-0.5 rounded mt-0.5">
                      Free Tool
                    </p>
                  </div>
                </Link>
                <Link href="/compare-colleges" className="text-white hover:text-orange-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <PencilLine className="w-4 h-4" />
                  <div>
                    <p>Compare Colleges</p>
                    <p className='bg-orange-500 text-[10px] flex items-center justify-center p-1 rounded'>Upto 4 Colleges</p>
                  </div>
                </Link>
                <button
                  onClick={toggleSaarthi}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>VV Saarthi</span>
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                </button>
              </div>

              {/* User Auth Section */}
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openModal()}
                    className="hidden sm:flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm"
                  >
                    <span>Get Guidance</span>
                  </button>
                  <UserButton />
                </div>
              ) : (
                <>
                  {/* Get Guidance Button */}
                  <button
                    onClick={() => openModal()}
                    className="hidden sm:flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm"
                  >
                    <span>Get Guidance</span>
                  </button>

                  {/* Mobile CTA (icon only) */}
                  <button
                    onClick={() => openModal()}
                    className="sm:hidden p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* Login Button */}
                  <Link href="/sign-in" className="hidden sm:flex items-center space-x-2 bg-white hover:bg-gray-50 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-all text-sm">
                    <span>Login</span>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Search Overlay */}
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Desktop Secondary Navigation */}
        <div className="hidden lg:block bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 xl:space-x-8 px-4">
            {mainNavItems.map((item) => (
              <div
                key={item.name}
                className="relative py-3 xl:py-4 group"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Trigger Button */}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-sm font-semibold transition-colors outline-none whitespace-nowrap text-gray-600 hover:text-orange-500"
                  >
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <button
                    className={`flex items-center space-x-1 text-sm font-semibold transition-colors outline-none whitespace-nowrap ${activeDropdown === item.name ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                      }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                )}

                {/* Desktop Dropdown */}
                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] xl:w-[550px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-[110] p-5 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div>
                      {item.dropdownContent.colleges && (
                        <div className="space-y-3">
                          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest border-b border-slate-50 pb-2">Colleges</h3>
                          <ul className="space-y-2">
                            {item.dropdownContent.colleges.map((college, i) => (
                              <li key={i}>
                                <Link href={`/colleges/${getSlug(college)}`} className="text-sm text-gray-500 hover:text-orange-500 cursor-pointer transition-colors leading-tight">
                                  {college}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {item.dropdownContent.viewAllLink && (
                      <div className="mt-5 pt-3 border-t border-gray-50">
                        <Link href={getViewAllHref(item.name)} className="flex items-center text-orange-500 font-bold text-xs hover:gap-2 transition-all">
                          {item.dropdownContent.viewAllLink}
                          <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div className={`absolute top-[60px] sm:top-16 left-0 right-0 bg-white shadow-xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-80px)] overflow-y-auto">
            {/* Compare Colleges Link */}
            <div className="border-b border-gray-100">
              <Link
                href="/compare-colleges"
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-800">Compare Colleges</span>
                <ArrowRight size={16} className="text-gray-500" />
              </Link>
            </div>

            {/* NEET Predictor - Mobile */}
            <div className="border-b border-gray-100">
              <Link
                href="/neet-rank-predictor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              >
                <span className="font-semibold text-orange-600 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                    <Target className="w-3.5 h-3.5" />
                  </span>
                  NEET Predictor
                  <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded">Free</span>
                </span>
                <ArrowRight size={16} className="text-orange-500" />
              </Link>
            </div>

            {/* VV Saarthi - Mobile */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => {
                  toggleSaarthi()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              >
                <span className="font-semibold text-orange-600 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  VV Saarthi
                  <Sparkles className="w-3 h-3 text-orange-400" />
                </span>
                <ArrowRight size={16} className="text-orange-500" />
              </button>
            </div>

            {mainNavItems.map((item) => (
              <div key={item.name} className="border-b border-gray-100">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <ArrowRight size={16} className="text-gray-500" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setMobileOpenDropdown(mobileOpenDropdown === item.name ? null : item.name)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left"
                  >
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown size={20} className={`text-gray-500 transition-transform duration-200 ${mobileOpenDropdown === item.name ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                )}

                {/* Mobile Dropdown Content */}
                {item.hasDropdown && mobileOpenDropdown === item.name && (
                  <div className="bg-gray-50 px-4 py-4 space-y-4">
                    {item.dropdownContent.colleges && (
                      <div>
                        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-2">Colleges</h3>
                        <ul className="space-y-2">
                          {item.dropdownContent.colleges.map((college, i) => (
                            <li key={i}>
                              <Link href={`/colleges/${getSlug(college)}`} className="text-sm text-gray-600 py-1 block hover:text-orange-500">
                                {college}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.dropdownContent.viewAllLink && (
                      <Link href={getViewAllHref(item.name)} className="flex items-center text-orange-500 font-bold text-sm pt-2">
                        {item.dropdownContent.viewAllLink}
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar