'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Rajesh Verma',
    role: 'Founder, PathFinder Education',
    city: 'Delhi',
    image: 'https://i.pinimg.com/736x/7c/f1/cd/7cf1cd277fcca1702c45f15fa50c22a3.jpg',
    quote:
      'VidyaVriddhi built our consultancy website and set up a lead pipeline. Enquiries doubled within the first month.',
  },
  {
    name: 'Sneha Kapoor',
    role: 'Director, BrightFuture Counsel',
    city: 'Mumbai',
    image: 'https://i.pinimg.com/736x/46/88/12/468812df30ab33d9c66397e40be563af.jpg',
    quote:
      'From website design to Instagram and WhatsApp leads — their team handles everything so we can focus on counselling.',
  },
  {
    name: 'Amit Joshi',
    role: 'CEO, Global Admit Hub',
    city: 'Pune',
    image: 'https://i.pinimg.com/1200x/9e/59/fc/9e59fcaf829d5e01db2ca872733a5338.jpg',
    quote:
      'Clean website, faster loading, and qualified education leads every week. Highly recommend for consultants.',
  },
  {
    name: 'Meera Iyer',
    role: 'Owner, Campus Connect',
    city: 'Bengaluru',
    image: 'https://i.pinimg.com/736x/a2/16/6f/a2166fc3a93c8f550e58e7b88a47012b.jpg',
    quote:
      'They redesigned our site and now manage our socials. Brand looks professional and students trust us more.',
  },
  {
    name: 'Vikram Singh',
    role: 'Partner, Aspire Abroad',
    city: 'Chandigarh',
    image: 'https://i.pinimg.com/736x/72/6f/0e/726f0eafd4441e68e1acf8ca057ef0ba.jpg',
    quote:
      'Lead quality is strong — parents who enquire are already serious about admissions. Great ROI for our agency.',
  },
]

export function ClientTestimonialsSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const active = testimonials[index]

  return (
    <div>
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#F27121]">
          Client Stories
        </p>
        <h2 className="text-2xl font-extrabold text-[#0b1f3a] sm:text-3xl">
          Consultants we&apos;ve helped grow
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          Real feedback from education brands whose websites and lead systems we built
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-orange-50/40 p-6 shadow-sm sm:p-10">
        <Quote className="absolute right-6 top-6 h-12 w-12 text-orange-100 sm:h-16 sm:w-16" />

        <div
          key={active.name}
          className="relative z-10 flex animate-[fadeSlide_0.45s_ease] flex-col gap-6 sm:flex-row sm:items-center"
        >
          <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-full shadow-lg ring-4 ring-orange-100 sm:mx-0 sm:h-28 sm:w-28">
            <Image
              src={active.image}
              alt={active.name}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="mb-3 flex justify-center gap-0.5 sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#F27121] text-[#F27121]" />
              ))}
            </div>
            <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
              &ldquo;{active.quote}&rdquo;
            </p>
            <div className="mt-4">
              <p className="font-bold text-[#0b1f3a]">{active.name}</p>
              <p className="text-sm text-slate-500">
                {active.role} · {active.city}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-7 bg-[#F27121]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#0b1f3a] hover:bg-[#0b1f3a] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
