import CollegeCards from './CollegeCards'
import Company from './Company'
import Hero from './Hero'
import Features from './Features'
import Slider from './Slider'
import FAQ from './FAQ'

export default async function BtechPage() {

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Company />
      <CollegeCards />
      <Slider />
      <Features />
      <FAQ />
    </div>
  )
}