'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Check, Phone, MapPin, Shield, Wifi, Utensils, Users, Shirt, GraduationCap,
  Globe, Coins, Plane, Hospital, Stethoscope, Flag, Building, Send, Loader2,
  CheckCircle2, ChevronDown, ChevronUp, FileText, Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Building, Shield, Wifi, Utensils, Users, Shirt,
  GraduationCap, Globe, Coins, Plane, Hospital,
  Stethoscope, Flag, CheckCircle2, FileText, Mail,
}

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
]

interface WhyChooseItem { title: string; desc: string; icon: string }
interface CareerOpp { title: string; desc: string; icon: string }
interface AdmissionStep { step: string; title: string; desc: string }
interface University { name: string; desc: string; tuition: string; image: string }
interface FAQ { q: string; a: string }

interface MBBSPageData {
  country: string
  countryLower: string
  heroBadge: string
  heroTitle: string
  heroDesc: string
  heroBullets: string[]
  quickBadges: { number: string; label: string }[]
  quickStats: { label: string; value: string }[]
  feeTotal: string
  feeSubtitle: string
  feeFacilities: string[]
  feeFacilityIcons: string[]
  eligibility: string[]
  documents: string[]
  careerOpps: CareerOpp[]
  admissionSteps: AdmissionStep[]
  whyChoose: WhyChooseItem[]
  universities: University[]
  gallery: string[]
  faqs: FAQ[]
  formCategory: string
  ctaTitle: string
  ctaDesc: string
}

export function MBBSPage({ data }: { data: MBBSPageData }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [neetScore, setNeetScore] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone || !state || !city) {
      return
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/mbbs-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, city, state, neetScore,
          category: data.formCategory,
        }),
      })
      const result = await res.json()
      if (res.ok) {
        setSuccess(true)
        setName(''); setEmail(''); setPhone(''); setNeetScore(''); setState(''); setCity('')
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const qsTitle = `MBBS in ${data.country} — Quick Stats 2026`
  const qsDesc = `All key details about the MBBS programme in ${data.country} at a glance.`

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[650px] flex items-center justify-center py-16 md:py-24 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-95">
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {data.heroBadge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
              {data.heroTitle}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
              {data.heroDesc}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-slate-200">
              {data.heroBullets.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-semibold">
                  <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-500/30 shrink-0">
                    <Check className="w-3.5 h-3.5 text-orange-400 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-slate-800">
              {data.quickBadges.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-3.5">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-400">{stat.number}</div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div id="form" className="lg:col-span-5 bg-white rounded-2xl shadow-2xl p-5 sm:p-6 lg:p-8 border border-slate-100">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 leading-snug">Start Your MBBS Journey</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 mb-5">
              Get expert admission guidance, fee details, and a personalized counsellor callback for MBBS in {data.country}.
            </p>
            {success ? (
              <div className="rounded-xl bg-orange-50 border border-orange-100 p-6 text-center space-y-4">
                <CheckCircle2 className="mx-auto h-12 w-12 text-orange-500" />
                <h4 className="text-lg font-bold text-orange-900">Thank You!</h4>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Your application has been received. Our senior medical admission expert will contact you shortly.
                </p>
                <button onClick={() => setSuccess(false)} className="text-xs font-bold text-orange-600 hover:underline">
                  Submit another application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name *"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address *"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400" />
                <input type="tel" required pattern="[0-9]{10}" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter 10-Digit Mobile Number *"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400" />
                <input type="number" value={neetScore} onChange={e => setNeetScore(e.target.value)} placeholder="NEET Score (out of 720)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400" />
                <select required value={state} onChange={e => setState(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all text-slate-600">
                  <option value="">Select State *</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="City *"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none transition-all placeholder:text-slate-400" />
                <button type="submit" disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? 'Submitting...' : 'Get Free Counselling'}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-medium">🔒 Your info is private & secure.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">{qsTitle}</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">{qsDesc}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {data.quickStats.map((stat, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 px-4 sm:px-6 py-3 sm:py-4 items-center hover:bg-white transition-all">
                  <div className="sm:col-span-5 font-bold text-slate-900 text-sm sm:text-base">{stat.label}</div>
                  <div className="sm:col-span-7 text-slate-600 text-sm sm:text-base mt-0.5 sm:mt-0 font-medium">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEE STRUCTURE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">MBBS Fee Structure in {data.country}</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">{data.country} offers one of the most budget-friendly MBBS programs for Indian students with a fully transparent fee structure.</p>
          </div>
          <div className="max-w-3xl mx-auto bg-slate-950 rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white border border-slate-800 shadow-2xl relative overflow-hidden mb-10 sm:mb-12">
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs sm:text-sm">Approximate Total Cost (Including Hostel)</p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-orange-400 mt-4 mb-4">{data.feeTotal}</h3>
            <p className="text-slate-300 text-sm font-medium">{data.feeSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {data.feeFacilities.map((facility, idx) => {
              const Icon = ICON_MAP[data.feeFacilityIcons[idx]]
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4 border border-orange-100">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{facility}</h4>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY & DOCUMENTS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Eligibility & Documents</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">Ensure you meet all requirements and have documents ready before applying for MBBS in {data.country}.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Eligibility Criteria</h3>
              </div>
              <ul className="space-y-4">
                {data.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <Check className="w-5 h-5 text-orange-500 stroke-[3] mt-0.5 shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-100">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Documents Required</h3>
              </div>
              <ul className="space-y-4">
                {data.documents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <Check className="w-5 h-5 text-orange-500 stroke-[3] mt-0.5 shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER OPPORTUNITIES */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">NMC Recognition & Career Opportunities</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">Medical universities in {data.country} are recognized by NMC, WHO and WDOMS — opening doors to licensing exams across the world.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {data.careerOpps.map((opp, idx) => {
              const Icon = ICON_MAP[opp.icon]
              return (
                <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 text-white hover:bg-slate-950 transition-all shadow-xl flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-400 mb-6 border border-slate-700">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold mb-3 text-white">{opp.title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{opp.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ADMISSION PROCESS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Admission Process for MBBS in {data.country}</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">A straightforward 6-step journey from free counselling to flying to {data.country} for your MBBS.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.admissionSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm mb-6 shadow-md shadow-orange-500/20">
                  {step.step}
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Why Choose {data.country} for MBBS?</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">{data.country} is a preferred destination for Indian students seeking quality medical education, global recognition, and an affordable path to an MBBS degree.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {data.whyChoose.map((item, idx) => {
              const Icon = ICON_MAP[item.icon]
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 border border-orange-100">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* TOP UNIVERSITIES */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Top Medical Universities</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">Explore reputed MBBS universities in {data.country} preferred by Indian students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {data.universities.map((uni, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                <div className="relative h-48 w-full">
                  <img src={uni.image} alt={uni.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs px-3 py-1 rounded-full">NMC Approved</div>
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2 leading-snug">{uni.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1">{uni.desc}</p>
                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tuition Fee</span>
                    <span className="text-sm font-black text-orange-600">{uni.tuition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Student Life in {data.country}</h2>
            <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">A glimpse into real campus experiences, student activities, and everyday life.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {data.gallery.map((img, idx) => (
              <div key={idx} className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden shadow-sm group">
                <img src={img} alt={`Student Life ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {data.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left focus:outline-none">
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base pr-4">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-slate-500 text-sm sm:text-base border-t border-slate-200/40 pt-4 bg-white/45">{faq.a}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-950 text-white border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <Image src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920" alt="Graduation background" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-orange-500/30">
            ⚡ Limited Seats — 2026 Intake
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">{data.ctaTitle}</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">{data.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="#form"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/15 w-full sm:w-auto justify-center">
              <Send className="w-4 h-4" /> Get Free Counselling
            </a>
            <a href="tel:9839865347"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-700 hover:border-slate-600 hover:bg-slate-900 text-white font-extrabold rounded-xl text-sm transition-all w-full sm:w-auto justify-center">
              <Phone className="w-4 h-4" /> Speak to Counsellor
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
