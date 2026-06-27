import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import ExplorePrograms from '@/components/ExplorePrograms'
import TopColleges from '@/components/TopColleges'
import UpcomingExams from '@/components/UpcomingExams'
import TopCourses from '@/components/TopCourses'
import TopStudyPlaces from '@/components/TopStudyPlaces'
import StudyAbroad from '@/components/StudyAbroad'
import Services from '@/components/Services'
import WhyChooseUs from '@/components/WhyChooseUs'
import FAQ from '@/components/FAQ'
import { TrendingInsights } from '@/components/TrendingInsights'
import CollegeListing from '@/components/CollegeListing'
import { InfiniteMovingCardsDemo } from '@/components/MovingCards'
import NeetRankPredictorSection from '@/components/NeetRankPredictorSection'
import { SITE_IDENTITY } from './site-identity'

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
};

const page = () => {
  return (
    <main className='h-full w-full relative overflow-x-hidden'>
      <Hero />
      <ExplorePrograms />
      <TopColleges/>
      <UpcomingExams />
      <NeetRankPredictorSection />
      <TopCourses />
      <TrendingInsights />
      <CollegeListing/>
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