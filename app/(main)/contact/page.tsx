import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, Mail, Phone, MapPin, Clock, GraduationCap, Users, Sparkles, ShieldCheck, Compass } from 'lucide-react'
import { SITE_IDENTITY, getFullAddress } from '../site-identity'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with VidyaVriddhi for college admissions, career counseling, exam guidance, and study abroad support. Call, email, or visit our office.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact VidyaVriddhi - Education Counseling & Admissions',
    description: 'Reach out to VidyaVriddhi for personalized educational guidance and admission support.',
  },
}

const supportOptions = [
  {
    title: 'Call our counselors',
    description: 'Speak directly with an expert for admission planning, exam guidance, and career clarity.',
    icon: Phone,
    href: `tel:${SITE_IDENTITY.contact.phone.display.replace(/\s+/g, '')}`,
  },
  {
    title: 'Email us',
    description: 'Share your goals and we will reply with the right next steps for your academic journey.',
    icon: Mail,
    href: `mailto:${SITE_IDENTITY.contact.email.support}`,
  },
  {
    title: 'Visit the office',
    description: 'Meet us in person for a personalized counseling session at our headquarters.',
    icon: MapPin,
    href: '#visit-us',
  },
]

const supportHighlights = [
  {
    title: 'Personalized counseling',
    description: 'We match every student with guidance that fits their profile, goals, and aspirations.',
    icon: Compass,
  },
  {
    title: 'Trusted support',
    description: 'From college selection to application strategy, our team stays with you at every step.',
    icon: ShieldCheck,
  },
  {
    title: 'Student-first approach',
    description: 'We simplify choices, clarify options, and make the journey feel confident and clear.',
    icon: Users,
  },
]

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(135deg,_#fff7ed_0%,_#f8fafc_55%,_#eef2ff_100%)] text-slate-900">
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-orange-500 transition-colors hover:text-orange-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-600 p-8 text-white shadow-2xl shadow-orange-100">
              <div className="inline-flex rounded-2xl bg-white/15 p-3">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
                Let&apos;s guide your next step with confidence
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-200">
                Whether you are choosing a college, planning a career, or preparing for exams, our counselors make the journey clear, personal, and practical.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SITE_IDENTITY.contact.email.support}`}
                  className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-orange-50"
                >
                  Email us
                </a>
                <a
                  href={`tel:${SITE_IDENTITY.contact.phone.display.replace(/\s+/g, '')}`}
                  className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Call now
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Office hours</h2>
                  <p className="text-sm text-slate-600">We are here to support your next move.</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Saturday</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Sunday</span>
                  <span className="font-semibold text-slate-900">Closed</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-semibold text-orange-700">Fast response</p>
                <p className="mt-1 text-sm text-slate-600">
                  Most inquiries are answered within 24 hours. For urgent admissions support, call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-3">
          {supportOptions.map((option) => {
            const Icon = option.icon
            return (
              <a
                key={option.title}
                href={option.href}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{option.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
              </a>
            )
          })}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div id="visit-us" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative h-72 overflow-hidden rounded-2xl">
              <Image
                src="/about/image-4.jpg"
                alt={`${SITE_IDENTITY.name} office`}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-2 text-orange-500">
                <MapPin className="h-5 w-5" />
                <h2 className="text-xl font-semibold text-slate-900">Visit our counseling center</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Located in the heart of {SITE_IDENTITY.contact.address.city}, our office is designed to make every student feel supported, welcomed, and confident about their next step.
              </p>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Address</p>
                <p className="mt-1">{getFullAddress()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Why students choose us</h2>
                <p className="text-sm text-slate-600">A guidance experience that blends expertise with care.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {supportHighlights.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ContactPage