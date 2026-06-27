'use client'

import CourseCategories from "./CourseCategories"
import CourseGrid from "./CourseGrid"
import EmploymentPartners from "./EmploymentPartners"
import Onlinehero from "./Onlinehero"
import StatisticsSection from "./StatisticsSection"
import Swiper from "./Swiper"
import WhatWeOfferSection from "./WhatWeOfferSection"



export default function OnlineMBAComponent() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Onlinehero    />
      <StatisticsSection />
      <Swiper />
      <EmploymentPartners />
      <WhatWeOfferSection />
      <CourseGrid />
      <CourseCategories />
    </div>
  )
}