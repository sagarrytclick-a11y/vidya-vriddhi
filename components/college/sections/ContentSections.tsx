import {
  Building2,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ListOrdered,
  Star,
  Award,
  Trophy,
  FileText,
  Download,
  Clock,
  Wifi,
  HeartPulse,
  Dumbbell,
  BookOpen,
  Utensils,
  Home,
  Globe2,
  Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdmissionButton } from '@/components/ui/AdmissionButton'
import { GallerySection } from '@/components/college/GallerySection'
import Link from 'next/link'

interface FeeCourse {
  course_name: string
  duration: string
  annual_tuition_fee: string
}

interface ContentSectionsProps {
  college: {
    name: string
    description: string | null
    features: string[]
    establishment_year: number | null
    Countryranking: string | null
    Internationalranking: string | null
    courses: { id: string }[]
    exams: { id: string; name: string; slug: string }[]
    categories: { id: string; name: string }[]
  }
  keyHighlights: {
    title?: string
    description?: string
    features?: string[]
  }
  whyChooseUs: {
    title?: string
    description?: string
    features?: { title: string; description: string }[]
  }
  documentsRequired: {
    title?: string
    description?: string
    documents?: string[]
  }
  feesStructure: {
    title?: string
    description?: string
    courses?: FeeCourse[]
  }
  admissionProcess: {
    title?: string
    description?: string
    steps?: string[]
  }
  campusHighlights: {
    title?: string
    description?: string
    highlights?: string[]
  }
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-orange-300 via-slate-200 to-transparent" />
    </div>
  )
}

export function ContentSections({
  college,
  keyHighlights,
  whyChooseUs,
  documentsRequired,
  feesStructure,
  admissionProcess,
  campusHighlights,
}: ContentSectionsProps) {
  const features = college.features || []
  const feeCourses = feesStructure?.courses || []
  const shortName = college.name?.split(' ').slice(0, 3).join(' ')

  const highlights = Array.isArray(campusHighlights?.highlights)
    ? campusHighlights.highlights
    : []
  const imageHighlights = highlights.filter(
    (h): h is string =>
      typeof h === 'string' &&
      (h.startsWith('http://') || h.startsWith('https://') || h.startsWith('data:'))
  )
  const textHighlights = highlights.filter(
    (h): h is string => typeof h === 'string' && !imageHighlights.includes(h)
  )

  return (
    <div className="flex-1 space-y-12">
      {/* About */}
      <section id="about" className="scroll-mt-24">
        <SectionHeading
          icon={Building2}
          title={`About ${shortName}`}
          subtitle="Overview, features & quick facts"
        />

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="p-5 sm:p-7">
            {college.description ? (
              <p className="text-[15px] leading-7 text-slate-700">
                {college.description}
              </p>
            ) : (
              <p className="text-[15px] text-slate-500">
                College overview will be updated soon.
              </p>
            )}

            {features.length > 0 && (
              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50/40 p-4 sm:p-5">
                <p className="mb-3 text-sm font-semibold text-slate-900">Key Features</p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
                        <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                      </span>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200">
            {[
              {
                value: college.establishment_year || '—',
                label: 'Established',
              },
              {
                value: `${college.courses.length || 0}+`,
                label: 'Courses',
              },
              {
                value: college.Countryranking ? `#${college.Countryranking}` : '—',
                label: 'Country Rank',
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 px-3 py-5 text-center sm:px-4">
                <p className="text-xl font-bold text-slate-900 sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      {keyHighlights?.features && keyHighlights.features.length > 0 && (
        <section id="highlights" className="scroll-mt-24">
          <SectionHeading
            icon={Sparkles}
            title={keyHighlights.title || 'Key Highlights'}
            subtitle="What stands out about this college"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {keyHighlights.features.map((feature, idx) => (
              <div
                key={idx}
                className="flex gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-sm font-bold text-orange-600">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed text-slate-700">{feature}</p>
              </div>
            ))}
          </div>

          {keyHighlights.description && (
            <p className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-sm">
              {keyHighlights.description}
            </p>
          )}
        </section>
      )}

      {/* Courses & Fees */}
      <section id="courses" className="scroll-mt-24">
        <SectionHeading
          icon={GraduationCap}
          title={feesStructure?.title || 'Courses & Fees 2026'}
          subtitle={
            feeCourses.length > 0
              ? `${feeCourses.length} program${feeCourses.length > 1 ? 's' : ''} with fee details`
              : 'Fee details for popular programs'
          }
        />

        {feeCourses.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3.5 sm:px-5">
              <div>
                <p className="text-sm font-semibold text-white">Fee Structure</p>
                <p className="text-xs text-slate-300">Academic year 2026</p>
              </div>
              <Badge className="border-0 bg-orange-500 text-white hover:bg-orange-500">
                {feeCourses.length} Courses
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <th className="w-12 px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                      #
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                      Course / Program
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                      Duration
                    </th>
                    <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                      Total Fees
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-5">
                      Apply
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeCourses.map((course, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 last:border-0 transition-colors hover:bg-orange-50/50"
                    >
                      <td className="px-4 py-4 text-slate-400 sm:px-5">{idx + 1}</td>
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                            <BookOpen className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {course.course_name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Full program fee
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {course.duration}
                        </span>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <p className="text-base font-bold text-orange-600">
                          {course.annual_tuition_fee}
                        </p>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex justify-end">
                          <AdmissionButton examName={college.name} variant="compact" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs leading-relaxed text-slate-500">
                Fees may vary by specialization and academic year. Confirm with the college before applying.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 border-slate-300 bg-white hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Brochure
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <GraduationCap className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-medium text-slate-600">Course & fee details coming soon</p>
          </div>
        )}

        {feesStructure?.description && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {feesStructure.description}
          </p>
        )}
      </section>

      {/* Admission Process */}
      {admissionProcess?.steps && admissionProcess.steps.length > 0 && (
        <section id="admission" className="scroll-mt-24">
          <SectionHeading
            icon={ListOrdered}
            title={admissionProcess.title || 'Admission Process'}
            subtitle="Step-by-step guide to apply"
          />

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <ol className="space-y-0">
              {admissionProcess.steps.map((step, idx) => (
                <li key={idx} className="relative flex gap-4 pb-7 last:pb-0">
                  {idx < admissionProcess.steps!.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-4 top-10 bottom-0 w-0.5 bg-orange-100"
                    />
                  )}
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-sm shadow-orange-200">
                    {idx + 1}
                  </span>
                  <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <p className="text-[15px] leading-relaxed text-slate-700">{step}</p>
                  </div>
                </li>
              ))}
            </ol>

            {admissionProcess.description && (
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {admissionProcess.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Why Choose */}
      {whyChooseUs?.features && whyChooseUs.features.length > 0 && (
        <section id="why-choose" className="scroll-mt-24">
          <SectionHeading
            icon={Star}
            title={whyChooseUs.title || 'Why Choose Us'}
            subtitle="Reasons students pick this college"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scholarships */}
      <section id="scholarship" className="scroll-mt-24">
        <SectionHeading
          icon={Award}
          title="Scholarships"
          subtitle="Financial aid & fee waivers available"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: 'Merit Scholarship',
              desc: '100% tuition waiver for top 10 rank holders',
              tag: 'Upto 100%',
            },
            {
              title: 'Need-Based Financial Aid',
              desc: 'Up to 75% fee waiver based on family income',
              tag: 'Upto 75%',
            },
            {
              title: 'Sports Excellence',
              desc: '50% fee waiver for national level athletes',
              tag: 'Upto 50%',
            },
            {
              title: 'Research Fellowship',
              desc: 'Monthly stipend for research scholars',
              tag: 'Stipend',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-700 hover:bg-orange-50"
                  >
                    {item.tag}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rankings */}
      <section id="ranking" className="scroll-mt-24">
        <SectionHeading
          icon={Trophy}
          title="Rankings"
          subtitle="National & international recognition"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
              <Flag className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-slate-700">NIRF Ranking</span>
            </div>
            <div className="px-5 py-6 text-center">
              <p className="text-4xl font-bold tracking-tight text-orange-600 sm:text-5xl">
                #{college.Countryranking || '—'}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">National ranking</p>
              <p className="mt-1 text-xs text-slate-500">Among top institutes in India</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
              <Globe2 className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold text-slate-700">QS World Ranking</span>
            </div>
            <div className="px-5 py-6 text-center">
              <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                #{college.Internationalranking || '—'}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">International ranking</p>
              <p className="mt-1 text-xs text-slate-500">Global recognition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hostel */}
      <section id="hostel" className="scroll-mt-24">
        <SectionHeading
          icon={Building2}
          title="Hostel & Campus"
          subtitle="Facilities available on campus"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Home,
              title: 'Accommodation',
              desc: 'Separate hostels for boys and girls with modern amenities',
            },
            {
              icon: Wifi,
              title: 'Wi-Fi Campus',
              desc: 'High-speed internet connectivity throughout the campus',
            },
            {
              icon: HeartPulse,
              title: 'Medical Facilities',
              desc: '24/7 security and on-campus medical facilities',
            },
            {
              icon: Dumbbell,
              title: 'Sports Complex',
              desc: 'Gym and sports facilities for students',
            },
            {
              icon: BookOpen,
              title: 'Library',
              desc: 'Library with books and digital resources',
            },
            {
              icon: Utensils,
              title: 'Cafeteria',
              desc: 'Hygienic cafeteria with diverse food options',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <item.icon className="h-5 w-5" />
              </div>
              <h4 className="mb-1 font-semibold text-slate-900">{item.title}</h4>
              <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      {documentsRequired?.documents && documentsRequired.documents.length > 0 && (
        <section id="documents" className="scroll-mt-24">
          <SectionHeading
            icon={FileText}
            title={documentsRequired.title || 'Documents Required'}
            subtitle="Keep these ready before applying"
          />

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <ul className="grid gap-3 sm:grid-cols-2">
              {documentsRequired.documents.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3 text-sm text-slate-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
            {documentsRequired.description && (
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
                {documentsRequired.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Campus highlights + gallery */}
      {(campusHighlights?.description || textHighlights.length > 0) && (
        <section id="campus" className="scroll-mt-24">
          <SectionHeading
            icon={Building2}
            title={campusHighlights.title || 'Campus Highlights'}
          />

          {campusHighlights.description && (
            <p className="mb-4 text-[15px] leading-7 text-slate-700">
              {campusHighlights.description}
            </p>
          )}

          {textHighlights.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {textHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm text-slate-700 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span className="leading-relaxed">{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {imageHighlights.length > 0 && (
        <section id="gallery" className="scroll-mt-24">
          <GallerySection images={imageHighlights} />
        </section>
      )}

      {/* Exams */}
      {college.exams.length > 0 && (
        <section className="scroll-mt-24">
          <SectionHeading icon={FileText} title="Accepted Exams" />
          <div className="flex flex-wrap items-center gap-2">
            {college.exams.map((exam) => (
              <Link key={exam.id} href={`/exams/${exam.slug}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-800"
                >
                  {exam.name}
                </Badge>
              </Link>
            ))}
            <Link href="/exams">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 hover:border-orange-300 hover:bg-orange-50"
              >
                View All
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
