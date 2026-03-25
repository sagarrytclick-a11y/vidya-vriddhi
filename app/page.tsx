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
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import LatestNewsStories from '@/components/LatestNewsStories'

const page = () => {
  return (
    <div className='h-full w-screen relative '>
      <Navbar />
      <Hero />
      <ExplorePrograms />
      <TopColleges/>
      <UpcomingExams />
      <TopCourses />
      <TopStudyPlaces />
      <StudyAbroad />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <LatestNewsStories />
      <Footer />
    </div>
  )
}

export default page