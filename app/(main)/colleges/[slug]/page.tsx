import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getCollegeBySlug, getRelatedColleges } from '@/lib/college-utils'
import { CollegeTabs } from '@/components/college/CollegeTabs'
import { HeroSection } from '@/components/college/sections/HeroSection'
import { ContentSections } from '@/components/college/sections/ContentSections'
import { CollegeSidebar } from '@/components/college/sections/CollegeSidebar'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const college = await getCollegeBySlug(slug)

  if (!college) {
    return { title: 'College Not Found | VidyaVriddhi' }
  }

  return {
    title: `${college.name} | Admission, Fees, Courses, Placements, Rankings`,
    description: college.description ? college.description.slice(0, 160) : `Explore ${college.name} — admission process, courses offered, fees structure, placements, rankings, and more.`,
    openGraph: {
      title: `${college.name} - College Details | VidyaVriddhi`,
      description: college.description?.slice(0, 160),
      images: college.imageURL ? [{ url: college.imageURL }] : [],
    },
  }
}

async function HeroSectionWrapper({ slug }: { slug: string }) {
  const college = await getCollegeBySlug(slug)
  if (!college) notFound()
  return <HeroSection college={college} />
}

async function ContentSectionWrapper({ slug }: { slug: string }) {
  const college = await getCollegeBySlug(slug)
  if (!college) return null

  const keyHighlights = college.keyHighlights as any || {}
  const whyChooseUs = college.whyChooseUs as any || {}
  const documentsRequired = college.documentsRequired as any || {}
  const feesStructure = college.feesStructure as any || {}
  const admissionProcess = college.admissionProcess as any || {}
  const campusHighlights = college.campusHighlights as any || {}

  return (
    <ContentSections
      college={college}
      keyHighlights={keyHighlights}
      whyChooseUs={whyChooseUs}
      documentsRequired={documentsRequired}
      feesStructure={feesStructure}
      admissionProcess={admissionProcess}
      campusHighlights={campusHighlights}
    />
  )
}

async function SidebarWrapper({ slug }: { slug: string }) {
  const college = await getCollegeBySlug(slug)
  if (!college) return null

  const [relatedColleges] = await Promise.all([
    getRelatedColleges(college.countryId, college.id),
  ])

  return <CollegeSidebar collegeName={college.name} relatedColleges={relatedColleges} />
}

function SectionFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-48 bg-gray-100 rounded-xl" />
    </div>
  )
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<BreadcrumbFallback />}>
        <HeroSectionWrapper slug={slug} />
      </Suspense>

      <Suspense fallback={null}>
        <CollegeTabs />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Suspense fallback={<SectionFallback />}>
              <ContentSectionWrapper slug={slug} />
            </Suspense>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse" />}>
              <SidebarWrapper slug={slug} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function BreadcrumbFallback() {
  return (
    <div className="animate-pulse">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}