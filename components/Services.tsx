'use client'

import Link from 'next/link'
import {
  Layout,
  Users,
  Share2,
  Megaphone,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'

const highlights = [
  {
    icon: Layout,
    title: 'Website Creation',
    description: 'High-converting websites for education consultancies.',
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description: 'Qualified student & parent leads delivered to your team.',
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Instagram, Facebook & LinkedIn managed end-to-end.',
  },
  {
    icon: Megaphone,
    title: 'Ads & Campaigns',
    description: 'Meta / Google ads that bring real admission enquiries.',
  },
]

export default function Services() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-[#0b1f3a] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#F27121] sm:text-sm">
                For Education Consultants
              </p>
              <h2 className="text-2xl font-extrabold leading-snug sm:text-3xl md:text-4xl">
                Grow your consultancy with websites, leads & social media
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                VidyaVriddhi helps education agencies look professional online, get more student
                enquiries, and stay active on social — from website build to lead delivery.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F27121] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#E05A1B]"
                >
                  Explore our services
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white/90 transition hover:text-white"
                >
                  Get a free consultation
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                <span>
                  <strong className="text-[#F27121]">100+</strong> projects
                </span>
                <span>
                  <strong className="text-[#F27121]">5K+</strong> leads
                </span>
                <span>
                  <strong className="text-[#F27121]">50+</strong> clients
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href="/services"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#F27121]/50 hover:bg-white/10"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F27121] text-white transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white sm:text-base">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
                      {item.description}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
