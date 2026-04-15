
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { unstable_cache } from 'next/cache'
import {
  ChevronRight, Calendar, Clock, FileText, Award, ArrowRight,
  CheckCircle2, Building2, ExternalLink, Download, BookOpen,
  GraduationCap, Users, Star, Sparkles, MapPin, Phone, Globe,
  Info, ClipboardList, TrendingUp, School, Mail,
  Target, FileCheck, Medal, Zap, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense, cloneElement } from 'react'
import { cn } from "@/lib/utils"
import { AdmissionButton } from '@/components/ui/AdmissionButton'
import { ExamHeroActions } from '@/components/exam/ExamHeroActions'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

// --- Data Fetching Logic (Unchanged) ---
const getExamBySlug = unstable_cache(
  async (slug: string) => {
    return db.exam.findUnique({
      where: { slug },
      include: {
        colleges: {
          where: { active: true },
          take: 8,
          select: {
            id: true,
            name: true,
            slug: true,
            logoURL: true,
            city: { select: { name: true } }
          }
        }
      }
    })
  },
  ['exam-detail'],
  { revalidate: 3600 }
)

const getRelatedExams = unstable_cache(
  async (examId: string, examType: string) => {
    return db.exam.findMany({
      where: {
        examType: examType as any,
        id: { not: examId },
        active: true
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        shortName: true,
        examImageurl: true,
        examMode: true,
        examType: true
      }
    })
  },
  ['related-exams'],
  { revalidate: 3600 }
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const exam = await getExamBySlug(slug)
  if (!exam) return { title: 'Exam Not Found' }
  return {
    title: `${exam.name} 2026 | Vidya Vriddhi`,
    description: exam.description || `Guide for ${exam.name} 2026.`,
  }
}

export default async function ExamDetailPage({ params }: PageProps) {

  const { slug } = await params
  const exam = await getExamBySlug(slug)

  if (!exam) notFound()

  const examPattern = exam.examPattern as any || {}
  const examDates = exam.examDates as any || {}
  const overview = exam.overview as any || {}
  const registration = exam.registration as any || {}
  const resultStatistics = exam.resultStatistics as any || {}
  const relatedExams = await getRelatedExams(exam.id, exam.examType)
  const totalQuestions = examPattern.tableData?.reduce((sum: number, row: any) => sum + (row.questions || 0), 0) || 0

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Premium Hero Section */}
      <div className="relative bg-slate-950 pt-12 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center text-sm font-medium text-slate-400 mb-8">
            <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/exams" className="hover:text-orange-400 transition-colors">Exams</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-100">{exam.shortName}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative w-32 h-32 bg-white rounded-2xl flex items-center justify-center p-4 shadow-2xl">
                    {exam.examImageurl ? (
                      <Image src={exam.examImageurl} alt={exam.shortName} width={90} height={90} className="object-contain" />
                    ) : (
                      <FileText className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 px-3 py-1">
                      {exam.examType.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 px-3 py-1">
                      {exam.examMode.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    {exam.name} <span className="text-orange-500">2026</span>
                  </h1>
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-orange-500" />
                      <span>{exam.conductingBody}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ExamHeroActions examName={exam.name} />
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
     <div className="bg-white border-b shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', title: 'Overview', icon: <Info /> },
              { id: 'dates', title: 'Dates', icon: <Calendar /> },
              { id: 'pattern', title: 'Pattern', icon: <ClipboardList /> },
              { id: 'registration', title: 'Apply', icon: <FileCheck /> },
            ].map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 whitespace-nowrap border border-transparent hover:border-orange-200"
              >
                <span className="text-slate-400 group-hover:text-orange-500 transition-colors">
                  {section.icon && cloneElement(section.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                </span>
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">

            {/* 1. Overview Section */}
            <section id="overview" className="scroll-mt-32">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Examination Profile
                </div>
                <h2 className="text-3xl font-bold text-slate-900">About the Entrance Exam</h2>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {overview.content || exam.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {overview.keyHighlights?.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                      <div className="mt-1 bg-orange-500 rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-800 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Key Metrics Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={<Clock />} label="Duration" value={`${examPattern.totalDurationMins || '--'} Min`} />
              <MetricCard icon={<Target />} label="Questions" value={totalQuestions} />
              <MetricCard icon={<Globe />} label="Mode" value={exam.examMode.replace('_', ' ')} />
              <MetricCard icon={<Bell />} label="Frequency" value={exam.frequency} />
            </section>

            {/* 3. Important Dates - Modern Timeline */}
            <section id="dates" className="scroll-mt-32">
              <Card className="border-0 bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-orange-500" />
                    Admission Timeline 2026
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-4">
                    {examDates.importantDates?.map((date: any, idx: number) => (
                      <div key={idx} className="relative pl-8 pb-4 last:pb-0 border-l-2 border-slate-200 last:border-l-0">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-orange-500" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                          <div>
                            <h4 className="font-bold text-slate-900">{date.event}</h4>
                            <p className="text-slate-500 text-sm">Scheduled Date</p>
                          </div>
                          <div className="px-4 py-2 bg-slate-900 text-white rounded-lg font-mono font-bold text-center">
                            {date.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 4. Exam Pattern Table */}
            <section id="pattern" className="scroll-mt-32">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold">Exam Pattern</h3>
                    <p className="text-slate-400 text-sm mt-1">Breakdown of subjects and marking</p>
                  </div>
                  <Badge className="bg-orange-500 text-white border-0">2026 Official</Badge>
                </div>
                <div className="p-0">
                  {examPattern.scoreRange && (
                    <div className="p-6 bg-orange-50 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <Target className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-slate-600 font-semibold">Score Range</p>
                          <p className="text-lg font-bold text-slate-900">{examPattern.scoreRange}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {examPattern.description && (
                    <div className="p-6 border-b border-slate-100">
                      <p className="text-slate-700 leading-relaxed">{examPattern.description}</p>
                    </div>
                  )}
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-6 text-slate-600 font-bold uppercase text-xs tracking-widest">Section</th>
                        <th className="p-6 text-slate-600 font-bold uppercase text-xs tracking-widest text-center">Questions</th>
                        <th className="p-6 text-slate-600 font-bold uppercase text-xs tracking-widest text-center">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examPattern.tableData?.map((row: any, i: number) => (
                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="p-6 font-bold text-slate-900">{row.section}</td>
                          <td className="p-6 text-center text-slate-700 font-semibold">{row.questions}</td>
                          <td className="p-6 text-center text-slate-700 font-semibold">{row.durationMins}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 5. Registration Section */}
            {registration.description && (
              <section id="registration" className="scroll-mt-32">
                <Card className="border-0 bg-gradient-to-br from-slate-50 to-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <FileCheck className="w-6 h-6 text-orange-500" />
                      Registration Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-700 leading-relaxed">{registration.description}</p>
                    {registration.bulletPoints && registration.bulletPoints.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-900">Required Documents:</h4>
                        <ul className="space-y-2">
                          {registration.bulletPoints.map((point: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                              <div className="mt-0.5 bg-orange-500 rounded-full p-0.5 shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-slate-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* 6. Result Statistics */}
            {resultStatistics.description && (
              <section className="scroll-mt-32">
                <Card className="border-0 bg-slate-50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Award className="w-6 h-6 text-orange-500" />
                      Result Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resultStatistics.totalMarks && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                          <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Total Marks</p>
                          <p className="text-3xl font-extrabold text-slate-900 mt-2">{resultStatistics.totalMarks}</p>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-2xl">
                          <p className="text-sm text-slate-600 font-semibold uppercase tracking-wider">Passing Criteria</p>
                          <p className="text-lg font-bold text-slate-900 mt-2">{resultStatistics.passingCriteria}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-slate-700 leading-relaxed">{resultStatistics.description}</p>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
            {/* Quick Action Card */}
            <Card className="border-0 shadow-xl shadow-orange-500/5 bg-white overflow-hidden">
              <div className="h-2 bg-orange-500" />
              <CardHeader>
                <CardTitle className="text-lg font-bold">Registration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 text-green-700">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Applications Open</p>
                    <p className="text-xs opacity-80">Phase 1 is currently active</p>
                  </div>
                </div>
                <AdmissionButton examName={exam.name} />
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Partner Institutions</p>
                  <div className="flex -space-x-3 overflow-hidden">
                    {exam.colleges?.slice(0, 5).map((c: any, i: number) => (
                      <Link key={i} href={`/colleges/${c.slug}`} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center overflow-hidden hover:ring-orange-500 transition-colors">
                        {c.logoURL ? <Image src={c.logoURL} alt="" width={40} height={40} /> : <School className="w-4 h-4 text-slate-400" />}
                      </Link>
                    ))}
                    <Link href={`/colleges`} className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-slate-900 text-white text-[10px] font-bold hover:bg-orange-600 transition-colors">
                      +{exam.colleges?.length}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Exams with Orange Accents */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Related Examinations
              </h3>
              <div className="grid gap-3">
                {relatedExams.map((related) => (
                  <Link
                    key={related.id}
                    href={`/exams/${related.slug}`}
                    className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                      {related.examImageurl ? (
                        <Image src={related.examImageurl} alt="" width={32} height={32} />
                      ) : (
                        <FileText className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{related.shortName}</h4>
                      <p className="text-xs text-slate-500">{related.examType.replace('_', ' ')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Box */}
            <div className="p-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold">Need Career Guidance?</h4>
                <p className="text-orange-50 text-sm leading-relaxed">Talk to our experts about registration, preparation, and college selection.</p>
                <AdmissionButton examName={exam.name} variant="white" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-orange-200 transition-colors group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
        {icon && cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xl font-extrabold text-slate-900 mt-1">{value}</p>
    </div>
  )
}