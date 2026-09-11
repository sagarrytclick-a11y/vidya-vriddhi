import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getCollegeBySlug, getRelatedColleges } from '@/lib/college-utils'
import { CollegeTabs } from '@/components/college/CollegeTabs'
import { HeroSection } from '@/components/college/sections/HeroSection'
import { ContentSections } from '@/components/college/sections/ContentSections'
import { CollegeSidebar } from '@/components/college/sections/CollegeSidebar'
import { CollegeJsonLd } from '@/components/seo/json-ld'
import { stripForMeta } from '@/lib/seo'
import {
  CollegeContentSkeleton,
  CollegeHeroSkeleton,
  CollegeSidebarSkeleton,
  CollegeTabsSkeleton,
} from '@/components/college/CollegeDetailSkeleton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const college = await getCollegeBySlug(slug)

  if (!college) {
    return { title: 'College Not Found' }
  }

  const description = college.description
    ? stripForMeta(college.description)
    : `Explore ${college.name} — admission process, courses offered, fees structure, placements, rankings, and more.`

  return {
    title: `${college.name} | Admission, Fees, Courses, Placements, Rankings`,
    description,
    alternates: { canonical: `/colleges/${slug}` },
    openGraph: {
      title: `${college.name} - College Details`,
      description,
      images: college.imageURL ? [{ url: college.imageURL }] : [],
      url: `/colleges/${slug}`,
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

export default async function CollegeDetailPage({ params }: PageProps) {
  const { slug } = await params
  const college = await getCollegeBySlug(slug)

  const description = college?.description
    ? stripForMeta(college.description)
    : college
      ? `Explore ${college.name} admissions, fees, courses, and placements.`
      : undefined

  return (
    <div className="min-h-screen bg-slate-50">
      {college && description && (
        <CollegeJsonLd
          name={college.name}
          description={description}
          url={`/colleges/${college.slug}`}
          image={college.imageURL || college.logoURL}
          address={{
            city: college.city?.name || 'India',
            country: college.country?.name || 'IN',
          }}
        />
      )}

      <Suspense fallback={<CollegeHeroSkeleton />}>
        <HeroSectionWrapper slug={slug} />
      </Suspense>

      <Suspense fallback={<CollegeTabsSkeleton />}>
        <CollegeTabs />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <Suspense fallback={<CollegeContentSkeleton />}>
              <ContentSectionWrapper slug={slug} />
            </Suspense>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <Suspense fallback={<CollegeSidebarSkeleton />}>
              <SidebarWrapper slug={slug} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
