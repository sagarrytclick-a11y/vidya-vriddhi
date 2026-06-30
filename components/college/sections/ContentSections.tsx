import { Building2, CheckCircle2, Sparkles, GraduationCap, BookOpen, Clock, Wallet, Download, ListOrdered, Star, Award, Trophy, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AdmissionButton } from '@/components/ui/AdmissionButton'
import { GallerySection } from '@/components/college/GallerySection'
import { getColorClasses } from '@/lib/college-utils'
import Link from 'next/link'
import Image from 'next/image'

interface ContentSectionsProps {
  college: {
    name: string
    description: string | null
    features: string[]
    establishment_year: number | null
    Countryranking: number | null
    Internationalranking: number | null
    courses: { id: string }[]
    exams: { id: string; name: string; slug: string }[]
    categories: { id: string; name: string }[]
  }
  keyHighlights: any
  whyChooseUs: any
  documentsRequired: any
  feesStructure: any
  admissionProcess: any
  campusHighlights: any
}

export function ContentSections({ college, keyHighlights, whyChooseUs, documentsRequired, feesStructure, admissionProcess, campusHighlights }: ContentSectionsProps) {
  const features = college.features || []

  return (
    <div className="flex-1 space-y-12">
      {/* About Section */}
      <section id="about" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            About {college.name?.split(' ').slice(0, 3).join(' ')}
          </h2>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg shadow-gray-100">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {college.description}
            </p>

            {features.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-3">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, idx) => (
                    <Badge
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 px-3 py-1.5 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{college.establishment_year || '2000'}</p>
                <p className="text-xs text-gray-600 mt-0.5">Established</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-green-600">{college.courses.length || '15'}+</p>
                <p className="text-xs text-gray-600 mt-0.5">Courses</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-orange-600">5000+</p>
                <p className="text-xs text-gray-600 mt-0.5">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Highlights Section */}
      {keyHighlights?.features && (
        <section id="highlights" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {keyHighlights.title || 'Key Highlights'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {keyHighlights.features.map((feature: string, idx: number) => (
              <Card
                key={idx}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-700 text-[15px] leading-relaxed pt-2">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {keyHighlights.description && (
            <Card className="mt-4 border-0 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-4">
                <p className="text-gray-700 text-[15px] flex items-start gap-2">
                  <span className="text-2xl">💡</span>
                  {keyHighlights.description}
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Courses & Fees Section */}
      <section id="courses" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Courses & Fees 2026</h2>
        </div>

        {feesStructure?.courses ? (
          <div className="grid gap-4">
            {feesStructure.courses.map((course: any, idx: number) => (
              <Card
                key={idx}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{course.course_name}</h3>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                    {course.duration}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</p>
                        <p className="font-semibold text-gray-900 mt-0.5">{course.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <Wallet className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Fees</p>
                        <p className="font-bold text-green-600 mt-0.5 text-lg">{course.annual_tuition_fee}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <AdmissionButton examName={college.name} variant="default" />
                      <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group/btn"
                      >
                        <Download className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                        Download Brochure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Course details coming soon</p>
            </CardContent>
          </Card>
        )}

        {feesStructure?.description && (
          <Card className="mt-4 border-0 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <p className="text-gray-700 text-[15px] flex items-start gap-2">
                <span className="text-xl">ℹ️</span>
                {feesStructure.description}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Admission Process */}
      {admissionProcess?.steps && (
        <section id="admission" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
              <ListOrdered className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {admissionProcess.title || 'Admission Process'}
            </h2>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-200 hidden md:block" />

                <div className="space-y-6">
                  {admissionProcess.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-4 relative group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300 z-10">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-orange-50 to-white p-4 rounded-xl border border-orange-100 group-hover:shadow-md transition-shadow duration-300">
                        <p className="text-gray-800 font-medium text-[15px] leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {admissionProcess.description && (
                <p className="mt-6 text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                  {admissionProcess.description}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Why Choose Us */}
      {whyChooseUs?.features && (
        <section id="why-choose" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-200">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {whyChooseUs.title || 'Why Choose Us'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {whyChooseUs.features.map((feature: any, idx: number) => (
              <Card
                key={idx}
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
              >
                <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

                <CardContent className="p-6 relative">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-2xl">
                        {idx === 0 ? '🏆' : idx === 1 ? '📚' : idx === 2 ? '🌟' : '🎯'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 text-[15px] leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}



      {/* Scholarships Section */}
      <section id="scholarship" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-200">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Scholarships</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: 'Merit Scholarship', desc: '100% tuition waiver for top 10 rank holders', icon: '🏆', color: 'yellow' },
            { title: 'Need-Based Financial Aid', desc: 'Up to 75% fee waiver based on family income', icon: '💰', color: 'blue' },
            { title: 'Sports Excellence', desc: '50% fee waiver for national level athletes', icon: '⚽', color: 'green' },
            { title: 'Research Fellowship', desc: 'Monthly stipend for research scholars', icon: '🔬', color: 'purple' },
          ].map((item, idx) => {
            const c = getColorClasses(item.color)
            return (
              <Card key={idx} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-[15px]">{item.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Rankings Section */}
      <section id="ranking" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Rankings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🇮🇳</span>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2">#{college.Countryranking || '1'}</p>
              <p className="font-semibold text-gray-700">NIRF Ranking 2025</p>
              <p className="text-sm text-gray-500 mt-1">Among Top Business Schools in India</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <p className="text-5xl font-bold text-orange-600 mb-2">#{college.Internationalranking || '100'}</p>
              <p className="font-semibold text-gray-700">QS World Ranking</p>
              <p className="text-sm text-gray-500 mt-1">Global MBA Rankings 2025</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hostel Section */}
      <section id="hostel" className="scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-200">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Hostel & Campus</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: '🏠', title: 'Accommodation', desc: 'Separate hostels for boys and girls with modern amenities', color: 'blue' },
            { icon: '📶', title: 'Wi-Fi Campus', desc: 'High-speed internet connectivity throughout the campus', color: 'green' },
            { icon: '🏥', title: 'Medical Facilities', desc: '24/7 security and on-campus medical facilities', color: 'red' },
            { icon: '🏋️', title: 'Sports Complex', desc: 'State-of-the-art gym and sports facilities', color: 'orange' },
            { icon: '📚', title: 'Library', desc: 'Library with 100,000+ books and digital resources', color: 'purple' },
            { icon: '🍽️', title: 'Cafeteria', desc: 'Hygienic cafeteria with diverse food options', color: 'yellow' },
          ].map((item, idx) => {
            const c = getColorClasses(item.color)
            return (
              <Card key={idx} className="group border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Documents Required */}
      {documentsRequired?.documents && (
        <section id="documents" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{documentsRequired.title || 'Documents Required'}</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-3">
                {documentsRequired.documents.map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
              {documentsRequired.description && (
                <p className="mt-4 text-sm text-gray-600">{documentsRequired.description}</p>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Campus Highlights */}
      {campusHighlights?.highlights && (
        <section id="campus" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{campusHighlights.title || 'Campus Highlights'}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {campusHighlights.highlights.map((highlight: any, idx: number) => {
              const isDataUrl = typeof highlight === 'string' && highlight.startsWith('data:')
              const isHttpUrl = typeof highlight === 'string' && (highlight.startsWith('http://') || highlight.startsWith('https://'))
              return (
                <div key={idx} className="relative rounded-lg overflow-hidden aspect-video">
                  {isDataUrl ? (
                    <Image
                      src={highlight}
                      alt={`Campus ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : isHttpUrl ? (
                    <Image
                      src={highlight}
                      alt={`Campus ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">{highlight}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section id="gallery" className="scroll-mt-24">
        <GallerySection images={campusHighlights?.highlights || []} />
      </section>

      {/* Exams Section */}
      {college.exams.length > 0 && (
        <section className="scroll-mt-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Accepted Exams</h2>
            <Link href="/exams">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-orange-50 hover:border-orange-200">
                View All Exams
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {college.exams.map((exam) => (
              <Link key={exam.id} href={`/exams/${exam.slug}`}>
                <Badge variant="secondary" className="text-sm px-4 py-2 hover:bg-orange-100 hover:text-orange-700 transition-colors cursor-pointer">
                  {exam.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}


    </div>
  )
}
