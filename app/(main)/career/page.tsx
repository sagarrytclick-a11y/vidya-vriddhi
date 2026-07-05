import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Users, Target, TrendingUp, HeartHandshake, Lightbulb, Sparkles, Globe, GraduationCap, Star, ChevronRight } from 'lucide-react'
import { CareerForm } from '@/components/CareerForm'
import { SITE_IDENTITY } from '../site-identity'

export const metadata: Metadata = {
  title: 'Careers at VidyaVriddhi | Join Our Team',
  description: 'Explore career opportunities at VidyaVriddhi. Join a team passionate about transforming education and guiding students toward their dreams.',
  openGraph: {
    title: 'Careers at VidyaVriddhi - Join Our Mission',
    description: 'Build your career while helping students build theirs. Explore openings at VidyaVriddhi.',
  },
}

const benefits = [
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Continuous learning, skill development programs, and clear career progression paths.' },
  { icon: HeartHandshake, title: 'Supportive Culture', desc: 'Collaborative environment where every voice matters and ideas are encouraged.' },
  { icon: Lightbulb, title: 'Innovation First', desc: 'Work with modern tools and platforms to deliver cutting-edge education solutions.' },
  { icon: Globe, title: 'Remote-Friendly', desc: 'Flexible work arrangements that let you do your best from anywhere.' },
  { icon: GraduationCap, title: 'Learning Budget', desc: 'Annual budget for courses, certifications, and professional development.' },
  { icon: Star, title: 'Impact-Driven', desc: 'Every project you work on directly helps students achieve their dreams.' },
]

const values = [
  { title: 'Student First', desc: 'Every decision we make starts with one question: how does this help students?' },
  { title: 'Integrity', desc: 'We are transparent with students, partners, and each other — always.' },
  { title: 'Excellence', desc: 'We hold ourselves to the highest standards in everything we deliver.' },
  { title: 'Collaboration', desc: 'Great things happen when diverse minds work together toward a shared mission.' },
]

const hiringSteps = [
  { step: '01', title: 'Submit Application', desc: 'Fill out the form below with your details and upload your resume.' },
  { step: '02', title: 'Initial Screen', desc: 'Our HR team reviews your application and reaches out within 5-7 days.' },
  { step: '03', title: 'Interviews', desc: 'Meet the team through a series of conversations to explore fit.' },
  { step: '04', title: 'Offer & Onboarding', desc: 'If it is a match, you will receive an offer and begin your journey with us.' },
]

function JobCard({ title, type, description, skills }: { title: string; type: string; description: string; skills: string[] }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{title}</h3>
        <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">{type}</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">{description}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s} className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">{s}</span>
        ))}
      </div>
    </div>
  )
}

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-100 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-100">Careers</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Build Your Career While Helping Students Build&nbsp;Theirs
            </h1>
            <p className="text-lg md:text-xl text-orange-100 leading-relaxed max-w-2xl">
              Join {SITE_IDENTITY.name} and be part of a team that transforms educational journeys every day.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Join {SITE_IDENTITY.shortName}?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We are not just another education platform. We are on a mission to make quality guidance accessible to every student.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Stand For</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our values guide everything we do — from product decisions to how we treat each other.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-slate-200 p-6 text-center hover:border-orange-200 transition-colors">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Process */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Hire</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">A transparent process designed to find the right fit for both sides.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {hiringSteps.map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white text-xl font-bold">
                {s.step}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Open Positions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We are looking for passionate people to join our growing team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <JobCard
              title="Full-Stack Developer"
              type="Full-time"
              description="Build and maintain web applications using Next.js, React, and Node.js. Work on products that serve thousands of students daily."
              skills={['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL']}
            />
            <JobCard
              title="Sales Executive"
              type="Full-time"
              description="Drive student enrollments and partnership growth. Connect with prospective students and guide them through the admission process."
              skills={['Communication', 'CRM', 'Lead Generation', 'Negotiation']}
            />
            <JobCard
              title="Social Media Executive"
              type="Full-time"
              description="Manage our brand presence across Instagram, LinkedIn, YouTube, and other platforms. Create engaging content that resonates with students."
              skills={['Content Creation', 'Instagram', 'LinkedIn', 'Analytics', 'Video Editing']}
            />
            <JobCard
              title="Education Counselor"
              type="Full-time"
              description="Provide personalized career and college guidance to students. Help them identify the right academic path based on their goals."
              skills={['Counseling', 'Career Guidance', 'Admissions', 'Communication']}
            />
            <JobCard
              title="Graphic Designer"
              type="Full-time / Contract"
              description="Create visual assets for web, social media, and print. Design engaging graphics that communicate our mission to students."
              skills={['Figma', 'Adobe Suite', 'UI Design', 'Typography', 'Branding']}
            />
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-600">Don&apos;t see a role that fits? Apply anyway — we are always looking for talented people.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Drop your resume below and we will be in touch when a role matches your profile.</p>
          <Link href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25">
            Apply Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Submit Your Application</h2>
          <p className="text-lg text-slate-600">Fill out the form below and attach your resume. We will review and reach out.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
          <CareerForm />
        </div>
      </section>
    </main>
  )
}
