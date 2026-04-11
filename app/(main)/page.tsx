import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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

const page = () => {
  return (
    <div className='h-full w-full relative overflow-x-hidden'>
      <Hero />
      <ExplorePrograms />
      <TopColleges/>
      <UpcomingExams />
      <TopCourses />
      <TrendingInsights />
      <CollegeListing/>
      <TopStudyPlaces />
      <StudyAbroad />
      <Services />
      <WhyChooseUs />
      <InfiniteMovingCardsDemo />
      <FAQ />
    </div>
  )
}

export default page