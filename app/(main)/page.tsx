import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import { SITE_IDENTITY } from './site-identity'

const ExplorePrograms = dynamic(() => import('@/components/ExplorePrograms'))
const TopColleges = dynamic(() => import('@/components/TopColleges'))
const UpcomingExams = dynamic(() => import('@/components/UpcomingExams'))
const NeetRankPredictorSection = dynamic(() => import('@/components/NeetRankPredictorSection'))
const TopCourses = dynamic(() => import('@/components/TopCourses'))
const TrendingInsights = dynamic(() =>
  import('@/components/TrendingInsights').then((m) => m.TrendingInsights)
)
const CollegeListing = dynamic(() => import('@/components/CollegeListing'))
const TopStudyPlaces = dynamic(() => import('@/components/TopStudyPlaces'))
const StudyAbroad = dynamic(() => import('@/components/StudyAbroad'))
const Services = dynamic(() => import('@/components/Services'))
const WhyChooseUs = dynamic(() => import('@/components/WhyChooseUs'))
const InfiniteMovingCardsDemo = dynamic(() =>
  import('@/components/MovingCards').then((m) => m.InfiniteMovingCardsDemo)
)
const FAQ = dynamic(() => import('@/components/FAQ'))

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'VidyaVriddhi | Best College Guidance, Exam Help, Study Abroad, and Admissions Support',
  description: 'VidyaVriddhi helps students find top colleges in India and abroad, offers NEET rank prediction, exam guidance, career counseling, and admission support for engineering, medical, law, MBA and more.',
  keywords: [
    'college guidance',
    'admission counseling',
    'NEET rank predictor',
    'study abroad',
    'career counseling',
    'engineering colleges',
    'medical colleges',
    'MBA admissions',
    'top universities',
    'Indian education consultancy',
  ],
  openGraph: {
    title: 'VidyaVriddhi - College Guidance, Exam Help & Study Abroad',
    description: 'Find top colleges, entrance exam guidance, study abroad opportunities, and personalised career counseling with VidyaVriddhi.',
    url: `https://${SITE_IDENTITY.domain}/`,
    siteName: SITE_IDENTITY.name,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: SITE_IDENTITY.meta.ogImage || '/logo.png',
        width: 1200,
        height: 630,
        alt: `${SITE_IDENTITY.name} Hero Image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VidyaVriddhi - College Guidance, Exam Help & Study Abroad',
    description: 'Find top colleges, entrance exam guidance, study abroad opportunities, and personalised career counseling with VidyaVriddhi.',
    images: [SITE_IDENTITY.meta.ogImage || '/logo.png'],
    creator: `@${SITE_IDENTITY.meta.author.replace(/\s+/g, '')}`,
  },
  alternates: {
    canonical: `https://${SITE_IDENTITY.domain}/`,
  },
}

const page = () => {
  return (
    <main className="relative h-full w-full overflow-x-hidden">
      <Hero />
      <ExplorePrograms />
      <TopColleges />
      <UpcomingExams />
      <NeetRankPredictorSection />
      <TopCourses />
      <TrendingInsights />
      <CollegeListing />
      <TopStudyPlaces />
      <StudyAbroad />
      <Services />
      <WhyChooseUs />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </main>
  )
}

export default page
