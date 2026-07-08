'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, ChevronUp, MessageCircle, Instagram, Linkedin, Youtube, Facebook, Twitter, Mail, MapPin } from 'lucide-react'
import { SITE_IDENTITY } from '../(main)/site-identity'

export default function MBBsLayout({ children }: { children: React.ReactNode }) {
  const { socials } = SITE_IDENTITY.contact
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      {/* SHARED HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo container prevents image shrinking */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="block">
              <Image 
                src={'/logo.png'} 
                height={80} 
                width={80} 
                alt="VidyaVriddhi Logo" 
                className="h-9 w-auto sm:h-10 md:h-12 object-contain" 
              />
            </Link>
          </div>

          {/* Clean flex wrapping for actions on extra small screens */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="tel:9839865347"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/15 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sm:inline">Call Us: 9839865347</span>
            </a>
            <a
              href="#form"
              className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              Get Free Counselling
            </a>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* SHARED FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 sm:py-16">
        {/* Adjusted grid breakpoints for better transition from mobile -> tablet -> desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16 mb-10 text-center md:text-left">
          
          {/* Brand block */}
          <div className="flex flex-col items-center md:items-start space-y-5">
            <div className="flex items-center shrink-0">
              <Link href="/" className="block">
                <Image 
                  src={'/logo.png'} 
                  height={80} 
                  width={80} 
                  alt="VidyaVriddhi Logo" 
                  className="h-9 w-auto bg-white rounded-lg px-2 py-1 sm:h-10 object-contain" 
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Vidya Vriddhi helps Indian students pursue MBBS abroad through trusted counselling, transparent guidance, and end-to-end admission assistance.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socials.youtube && (
                <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socials.whatsapp && (
                <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-orange-400 flex items-center justify-center rounded-xl border border-slate-800 transition-all">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links block */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-base tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><a href="#form" className="hover:text-orange-400 transition-colors">Why Abroad</a></li>
              <li><a href="#form" className="hover:text-orange-400 transition-colors">Universities</a></li>
              <li><a href="#form" className="hover:text-orange-400 transition-colors">Gallery</a></li>
              <li><a href="#form" className="hover:text-orange-400 transition-colors">FAQ</a></li>
              <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact details block */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-base tracking-wide uppercase">Contact</h4>
            <ul className="space-y-3 text-sm font-semibold flex flex-col items-center md:items-start">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <a href={`tel:${SITE_IDENTITY.contact.phone.additional?.[0] || SITE_IDENTITY.contact.phone.raw}`} className="hover:text-orange-400 transition-colors text-slate-300">{SITE_IDENTITY.contact.phone.display}</a>
              </li>
              <li className="flex items-start gap-3 max-w-full">
                <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="break-all text-left">{SITE_IDENTITY.contact.email.support}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-left">{SITE_IDENTITY.contact.address.office}, {SITE_IDENTITY.contact.address.city}, {SITE_IDENTITY.contact.address.country}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 text-center text-[11px] space-y-4">
          <p className="leading-relaxed max-w-4xl mx-auto text-slate-500">
            Disclaimer: Vidya Vriddhi is a counselling and guidance platform. We do not guarantee admission to any institution. All information provided is for reference purposes and subject to change as per respective authorities. Students are advised to verify details directly with colleges and regulatory bodies.
          </p>
          <p className="text-slate-600 font-semibold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Vidya Vriddhi. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 p-2.5 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </div>
  )
}