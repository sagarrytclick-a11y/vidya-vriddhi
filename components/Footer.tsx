'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronUp, Facebook, Instagram, Twitter, Youtube, Linkedin, Rss, Mail, Phone, MapPin } from 'lucide-react'
import { SITE_IDENTITY } from '@/app/site-identity'

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
                    {SITE_IDENTITY.contact.address.city}, {SITE_IDENTITY.contact.address.country}
                  </span>
                </div>
              </div>
            </div>
            {/* Top Colleges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Colleges</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">M.B.A</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">B.Tech/B.E</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">MCA</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">BCA</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">M.Tech</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">MA</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">BA</a></li>
              </ul>
            </div>

            {/* Top Universities */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Universities</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Engineering</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Management</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Medical</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Law</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Commerce</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Science</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Arts</a></li>
              </ul>
            </div>

            {/* Top Exams */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Top Exam</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">CAT</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">GATE</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Jee-Main</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">NEET</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">XAT</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">CLAT</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">MAT</a></li>
              </ul>
            </div>

            {/* Study Abroad - Column 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Study Abroad</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Canada</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">USA</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">UK</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">UAE</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Australia</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Germany</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sweden</a></li>
              </ul>
            </div>

            {/* Study Abroad - Column 2 */}
          </div>

          {/* Other Links */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About {SITE_IDENTITY.name}</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
              <a href="/advertising" className="text-gray-300 hover:text-white transition-colors">Advertising</a>
              <a href="/careers" className="text-gray-300 hover:text-white transition-colors">Career</a>
              <a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a>
              <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
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

              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Download the {SITE_IDENTITY.name} app on</span>
                <a href="#" className="bg-black hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
                  <span className="text-sm">Google Play</span>
                </a>
                <a href="#" className="bg-black hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
                  <span className="text-sm">App Store</span>
                </a>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-3 ml-0 md:ml-8">
                {SITE_IDENTITY.contact.socials.facebook && (
                  <a href={SITE_IDENTITY.contact.socials.facebook} className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                <a href={SITE_IDENTITY.contact.socials.instagram} className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                {SITE_IDENTITY.contact.socials.twitter && (
                  <a href={SITE_IDENTITY.contact.socials.twitter} className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href={SITE_IDENTITY.contact.socials.linkedin} className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Rss className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </>
  )
}

export default Footer
