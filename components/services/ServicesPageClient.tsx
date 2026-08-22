'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Phone,
  Layout,
  Users,
  Share2,
  Megaphone,
  Globe,
  LineChart,
  CheckCircle2,
} from 'lucide-react'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'
import { ClientTestimonialsSlider } from '@/components/services/ClientTestimonialsSlider'
import { ServiceEnquiryModal } from '@/components/services/ServiceEnquiryModal'

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    alt: 'Digital growth and analytics dashboard',
  },
  {
    src: 'https://i.pinimg.com/1200x/a3/76/df/a376dfc3058c438bc9595662acd88b95.jpg',
    alt: 'Social media marketing',
  },
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    alt: 'Website development workspace',
  },
  {
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    alt: 'Education consultancy team meeting',
  },
]

const partners = [
  {
    name: 'Admission Campus',
    url: 'admissioncampus.in',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-1625f5b6-1bf0-4d7f-b9c5-76082c2a6de4.png',
  },
  {
    name: 'Education Times Abroad',
    url: 'educationtimesabroad.com',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-53114713-15a4-4423-8e58-0f1f05da1bd7.png',
  },
  {
    name: 'Future Mind Education',
    url: 'futuremindedu.in',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-0f82d821-9102-4117-87bd-21f67fca9158.png',
  },
  {
    name: 'Himalayan Education',
    url: 'https://www.himalyaneducation.com/',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-469680e4-c72f-47d2-9c07-2923849f5be2.png',
  },
  {
    name: 'Summit Global',
    url: 'https://www.summitglobal.co.in/',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-953929c4-0780-4ede-8e1d-970cb2438f8f.png',
  },
  {
    name: 'Your Online MBA',
    url: 'youronlinemba.in',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-841dd008-9ff0-4c13-afed-a815cd75a2c9.png',
  },
  {
    name: 'Alpha World Education',
    url: 'alphaworldeducation.com',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-0a7679c1-b1bf-4c0f-bf29-4bd738c5c9dc.png',
  },
  {
    name: 'Key2Global',
    url: 'key2education.com',
    image: 'https://ik.imagekit.io/neyanvn5i/cms-uploads/upload-9846e48c-c097-4218-9a9c-4eb04ca77fdf.png',
  },
]

const services = [
  {
    icon: Layout,
    title: 'Website Creation',
    description:
      'Conversion-focused websites for education consultancies — clean design, enquiry forms, and mobile-first speed.',
    points: ['Custom brand design', 'College listing pages', 'WhatsApp CTAs', 'Fast delivery'],
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description:
      'Qualified student and parent leads delivered to consultants so your team only speaks to serious enquiries.',
    points: ['City & course targeting', 'Verified contacts', 'Daily / weekly packs', 'CRM-ready sheets'],
  },
  {
    icon: Share2,
    title: 'Social Media',
    description:
      'Instagram, Facebook & LinkedIn managed end-to-end — creatives, reels, captions, and engagement.',
    points: ['Content calendar', 'Reel creatives', 'Community replies', 'Monthly reports'],
  },
  {
    icon: Megaphone,
    title: 'Ads & Campaigns',
    description:
      'Meta and Google campaigns tuned for admission enquiries, not empty traffic.',
    points: ['Ad creatives', 'Audience targeting', 'Budget control', 'Lead forms'],
  },
  {
    icon: Globe,
    title: 'Brand Presence',
    description:
      'Logo, landing pages, and online identity so parents trust your consultancy from the first click.',
    points: ['Logo & brand kit', 'Landing pages', 'Domain help', 'Profile setup'],
  },
  {
    icon: LineChart,
    title: 'Growth Consulting',
    description:
      'Practical playbooks to scale an education agency with websites, leads, and retention.',
    points: ['Funnel review', 'Package pricing', 'Process design', 'Monthly reviews'],
  },
]

const years =
  Math.max(1, new Date().getFullYear() - SITE_IDENTITY.business.established)

export default function ServicesPageClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const phoneDisplay = SITE_IDENTITY.contact.phone.display
  const phoneTel = SITE_IDENTITY.contact.phone.raw.replace(/\s+/g, '')

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fafafa] text-slate-800">
      <ServiceEnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F27121] transition hover:text-[#E05A1B]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 rounded-full bg-[#0b1f3a] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#132a4a] sm:px-4 sm:text-sm"
          >
            Get a quote
          </button>
        </div>
      </div>

      {/* About — left images, right content (no centered middle title) */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* LEFT — images only */}
            <div className="relative w-full">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {gallery.map((item, i) => (
                  <div
                    key={item.src}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg ${
                      i % 2 === 1 ? 'mt-6 sm:mt-10' : ''
                    }`}
                  >
                    <div className="relative h-32 w-full sm:h-40 md:h-48 lg:h-44 xl:h-52">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 45vw, 320px"
                        priority={i < 2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience badge — sits on image edge, not in page center */}
              <div className="absolute -bottom-4 right-4 z-10 sm:-bottom-5 sm:right-6 lg:-right-6">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#0b1f3a] text-center text-white shadow-2xl sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <span className="text-lg font-extrabold sm:text-xl md:text-2xl">{years}+</span>
                  <span className="px-2 text-[9px] font-medium leading-tight sm:text-[10px] md:text-xs">
                    Years Experience
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — all text lives here */}
            <div className="w-full lg:pl-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F27121] sm:mb-3 sm:text-sm">
                About Our Services
              </p>
              <h1 className="mb-4 text-2xl font-extrabold leading-snug text-[#0b1f3a] sm:mb-5 sm:text-3xl sm:leading-tight md:text-4xl">
                Helping education consultants grow with websites, leads & social media
              </h1>

              <p className="mb-4 text-sm font-bold tracking-wide text-[#0b1f3a] sm:text-base md:text-lg">
                Websites <span className="text-[#F27121]">|</span> Student Leads{' '}
                <span className="text-[#F27121]">|</span> Social Media{' '}
                <span className="text-[#F27121]">|</span> Ads
              </p>

              <p className="mb-3 text-sm leading-relaxed text-slate-600 sm:text-[15px] md:text-base">
                VidyaVriddhi is a one-stop growth partner for education consultants. We design
                high-converting websites, deliver qualified admission leads, and manage your social
                presence so parents find you — and trust you — online.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:mb-8 md:text-base">
                From Noida to pan-India consultancies, our work helps agencies get more enquiries,
                look more professional, and spend less time chasing cold traffic.
              </p>

              <ul className="mb-6 grid grid-cols-1 gap-2 sm:mb-8 sm:grid-cols-2 sm:gap-2.5">
                {[
                  'Website creation for consultancies',
                  'Qualified education leads',
                  'Social media handling',
                  'Ads that bring real enquiries',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F27121]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#132a4a] sm:w-auto sm:px-6 sm:py-3.5"
                >
                  Discover More
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={`tel:${phoneTel}`}
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-orange-200 hover:bg-orange-50/40 sm:w-auto sm:px-4 sm:py-3"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-white transition group-hover:bg-[#F27121] sm:h-11 sm:w-11">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-xs text-slate-500">Call us anytime</span>
                    <span className="block truncate text-sm font-bold text-[#0b1f3a]">
                      {phoneDisplay}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#0b1f3a] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F27121] sm:text-sm">
              Our Impact
            </p>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl md:text-3xl">
              Numbers that speak for our work
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {[
              { value: '100+', label: 'Projects Completed', hint: 'Websites & campaigns' },
              { value: '5K+', label: 'Leads Delivered', hint: 'To education consultants' },
              { value: '50+', label: 'Happy Clients', hint: 'Agencies across India' },
              { value: '20+', label: 'Cities Covered', hint: 'Pan-India presence' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm transition hover:border-[#F27121]/40 hover:bg-white/10 sm:px-5 sm:py-6"
              >
                <p className="text-3xl font-extrabold tracking-tight text-[#F27121] sm:text-4xl md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">{stat.label}</p>
                <p className="mt-1 text-[11px] text-white/55 sm:text-xs">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F27121] sm:text-sm">
            Trusted By
          </p>
          <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl md:text-3xl">
            Brands We&apos;ve Worked With
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:mt-3 sm:text-base">
            Education consultancies and admission agencies across India trust us for websites,
            leads, and social growth.
          </p>

          <div className="relative mt-8 overflow-hidden sm:mt-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-14" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-14" />
            <div
              className="flex w-max gap-4 sm:gap-5 [animation:services-marquee_36s_linear_infinite] hover:[animation-play-state:paused]"
            >
              {[...partners, ...partners].map((partner, i) => (
                <a
                  key={`${partner.name}-${i}`}
                  href={`https://${partner.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-[200px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg sm:w-[240px] sm:rounded-2xl md:w-[260px]"
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-300 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 sm:h-2 sm:w-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 sm:h-2 sm:w-2" />
                    <span className="ml-1 truncate rounded-md bg-white px-1.5 py-0.5 text-[9px] text-slate-400 ring-1 ring-slate-100 sm:ml-2 sm:px-2 sm:text-[10px]">
                      {partner.url}
                    </span>
                  </div>
                  <div className="relative h-28 w-full overflow-hidden bg-slate-100 sm:h-36">
                    <Image
                      src={partner.image}
                      alt={`${partner.name} website`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="260px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left sm:p-3">
                      <p className="truncate text-xs font-bold text-white sm:text-sm">
                        {partner.name}
                      </p>
                      <p className="truncate text-[10px] text-white/80 sm:text-[11px]">
                        Visit website →
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F27121] sm:text-sm">
              What We Offer
            </p>
            <h2 className="text-xl font-extrabold text-[#0b1f3a] sm:text-2xl md:text-3xl">
              Everything your consultancy needs to grow
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <article
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-orange-200 hover:shadow-lg sm:p-6"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-50 transition group-hover:bg-orange-100/80" />
                  <div className="relative">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1f3a] text-white transition group-hover:bg-[#F27121] sm:mb-4 sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-[#0b1f3a] sm:text-lg">
                      {service.title}
                    </h3>
                    <p className="mb-3 text-sm leading-relaxed text-slate-600 sm:mb-4">
                      {service.description}
                    </p>
                    <ul className="mb-4 space-y-1.5 sm:mb-5">
                      {service.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F27121]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#F27121]"
                    >
                      Get started
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ClientTestimonialsSlider />
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#0b1f3a] px-5 py-10 text-center text-white sm:rounded-3xl sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-[#F27121]/25 blur-3xl" />
          <div className="relative">
            <h2 className="text-xl font-extrabold sm:text-2xl md:text-3xl">
              Ready to grow your education consultancy?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 sm:text-base">
              Share your name, email, number and message — we&apos;ll email you back and save it for
              our team.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F27121] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#E05A1B] sm:mt-7 sm:px-7 sm:py-3.5"
            >
              Open enquiry form
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes services-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
