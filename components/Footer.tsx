'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronUp, Facebook, Instagram, Twitter, Youtube, Linkedin, Rss, Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info - 2 columns */}
            <div className="lg:col-span-2">
              {/* Logo and Title */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-30 h-15 bg-white rounded-lg p-2">
                  <Image 
                    src={SITE_IDENTITY.assets.logo.main}
                    alt={`${SITE_IDENTITY.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {SITE_IDENTITY.description}
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-400" />
                  <a href={`mailto:${SITE_IDENTITY.contact.email.support}`} className="text-gray-300 hover:text-white transition-colors">
                    {SITE_IDENTITY.contact.email.support}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-400" />
                  <a href={`tel:${SITE_IDENTITY.contact.phone.raw}`} className="text-gray-300 hover:text-white transition-colors">
                    {SITE_IDENTITY.contact.phone.display}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-300">
                    {SITE_IDENTITY.contact.address.office}
                  </span>
                </div>
              </div>
            </div>
            {/* Top Colleges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Courses</h3>
              <ul className="space-y-2">
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">M.B.A</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">B.Tech/B.E</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">MCA</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">BCA</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">M.Tech</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">MA</Link></li>
                <li><Link href="/courses" className="text-gray-300 hover:text-white transition-colors">BA</Link></li>
              </ul>
            </div>

            {/* Top Universities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Colleges</h3>
              <ul className="space-y-2">
                <li><Link href="/colleges/national-law-school-of-india-university-bangalore" className="text-gray-300 hover:text-white transition-colors">NLSI</Link></li>
                <li><Link href="/colleges/all-india-institute-of-medical-sciences-aiims" className="text-gray-300 hover:text-white transition-colors">AIIMS</Link></li>
                <li><Link href="/colleges/Indian%20Institute%20of%20Management%20Bangalore" className="text-gray-300 hover:text-white transition-colors">IIM Bangalore</Link></li>
                <li><Link href="/colleges/hindu-college-university-of-delhi" className="text-gray-300 hover:text-white transition-colors">Hindu College</Link></li>
                <li><Link href="/colleges/dr-d-y-patil-vidyapeeth-deemed-to-be-university" className="text-gray-300 hover:text-white transition-colors">Dr. D.Y. Patil University</Link></li>
                <li><Link href="/colleges/vardhman-mahavir-medical-college-vmmc" className="text-gray-300 hover:text-white transition-colors">VMMC</Link></li>
                <li><Link href="/colleges/the-institute-of-hotel-management-bangalore" className="text-gray-300 hover:text-white transition-colors">IHM Bangalore</Link></li>
              </ul>
            </div>

            {/* Top Exams */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Exam</h3>
              <ul className="space-y-2">
                <li><Link href="/exams/common-admission-test" className="text-gray-300 hover:text-white transition-colors">CAT</Link></li>
                <li><Link href="/exams/national-eligibility-entrance-test-undergraduate" className="text-gray-300 hover:text-white transition-colors">GATE</Link></li>
                <li><Link href="/exams/joint-entrance-examination-main" className="text-gray-300 hover:text-white transition-colors">Jee-Main</Link></li>
                <li><Link href="/exams/joint-entrance-examination-advanced" className="text-gray-300 hover:text-white transition-colors">Jee-Advanced</Link></li>
              </ul>
            </div>

            {/* Study Abroad - Column 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Study Abroad</h3>
              <ul className="space-y-2">
                <li><Link href="/countries/bangladesh" className="text-gray-300 hover:text-white transition-colors">Bangladesh</Link></li>
                <li><Link href="/countries/georgia" className="text-gray-300 hover:text-white transition-colors">Georgia</Link></li>
                <li><Link href="/countries/uzbekistan" className="text-gray-300 hover:text-white transition-colors">Uzbekistan</Link></li>
                <li><Link href="/countries/russia" className="text-gray-300 hover:text-white transition-colors">Russia</Link></li>
                <li><Link href="/colleges" className="text-gray-300 hover:text-white transition-colors">India</Link></li>
               
              </ul>
            </div>

            {/* Study Abroad - Column 2 */}
          </div>

            {/* Other Links */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 text-xs sm:text-sm">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About {SITE_IDENTITY.name}</Link>
              <Link href="/career" className="text-gray-300 hover:text-white transition-colors">Career</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-800 rounded-lg p-4 mb-8">
              <h4 className="text-orange-400 font-semibold mb-2">Disclaimer</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                The information provided on {SITE_IDENTITY.name} is for general informational purposes only. While we strive to keep the information accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the information. Users are advised to verify information from official sources before making any decisions.
              </p>
            </div>

            {/* App Download and Social Media */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="text-lg font-semibold">{SITE_IDENTITY.name}</div>
                <span className="text-gray-400">© {new Date().getFullYear()} {SITE_IDENTITY.name}. All Rights Reserved</span>
              </div>

          

              {/* Social Media Icons */}
              <div className="flex items-center space-x-3 ml-0 md:ml-8">
                {SITE_IDENTITY.contact.socials.whatsapp && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.whatsapp} className="text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                )}
                {SITE_IDENTITY.contact.socials.instagram && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.instagram} className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </Link>
                )}
                {SITE_IDENTITY.contact.socials.linkedin && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.linkedin} className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                )}
                {SITE_IDENTITY.contact.socials.youtube && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.youtube} className="text-gray-400 hover:text-white transition-colors">
                    <Youtube className="w-5 h-5" />
                  </Link>
                )}
                {SITE_IDENTITY.contact.socials.facebook && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.facebook} className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </Link>
                )}
                {SITE_IDENTITY.contact.socials.twitter && (
                  <Link target="_blank" href={SITE_IDENTITY.contact.socials.twitter} className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-2 sm:bottom-8 right-2 sm:right-8 p-2 sm:p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}

export default Footer
