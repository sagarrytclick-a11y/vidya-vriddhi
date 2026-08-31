import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Building2, MapPin } from 'lucide-react'
import { db } from '@/lib/db'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CourseJsonLd } from '@/components/seo/json-ld'
import { stripForMeta } from '@/lib/seo'
import { SITE_IDENTITY } from '@/app/(main)/site-identity'
import { AdmissionButton } from '@/components/ui/AdmissionButton'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await db.course.findFirst({ where: { slug, active: true } })
  if (!course) return { title: 'Course Not Found' }

  const description =
    stripForMeta(course.description) ||
    `Explore ${course.name} colleges, fees, admissions, and career options with ${SITE_IDENTITY.name}.`

  return {
    title: `${course.name} | Colleges, Fees & Admissions`,
    description,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: `${course.name} Course Guide`,
      description,
      url: `/courses/${slug}`,
    },
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params

  const course = await db.course.findFirst({
    where: { slug, active: true },
    include: {
      colleges: {
        where: { active: true },
        take: 24,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
          description: true,
          city: { select: { name: true } },
          country: { select: { name: true } },
        },
      },
    },
  })

  if (!course) notFound()

  const description =
    stripForMeta(course.description) ||
    `Find top colleges offering ${course.name}. Compare admissions, fees, and placements.`

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-white">
      <CourseJsonLd
        name={course.name}
        description={description}
        provider={SITE_IDENTITY.name}
        url={`/courses/${course.slug}`}
      />

      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            All courses
          </Link>
          <Breadcrumbs
            dark
            items={[
              { label: 'Courses', href: '/courses' },
              { label: course.name },
            ]}
          />
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">{course.name}</h1>
          <p className="mt-4 text-orange-100 max-w-3xl text-lg">{description}</p>
          <div className="mt-6">
            <AdmissionButton examName={course.name} />
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Colleges offering {course.name}
        </h2>

        {course.colleges.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No active colleges listed for this course yet.</p>
            <Link href="/colleges" className="inline-block mt-4 text-orange-600 font-medium hover:underline">
              Browse all colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {course.colleges.map((college) => (
              <Link
                key={college.id}
                href={`/colleges/${college.slug}`}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {college.logoURL ? (
                    <Image
                      src={college.logoURL}
                      alt={college.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{college.name}</h3>
                  {(college.city?.name || college.country?.name) && (
                    <p className="mt-1 text-sm text-gray-500 inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {[college.city?.name, college.country?.name].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {college.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{college.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
