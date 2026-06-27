import React from 'react'

const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-[#FFEDD5] via-[#FFF7ED] to-[#FEF3C7] py-16 md:py-24 lg:py-32">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#331B00]  mb-6">
              Future-Proof Your Career with a <span className="text-[#D97706]">B.Tech</span> Degree
            </h1>
            <p className="text-lg text-[#5A4A42] mb-8 max-w-lg mx-auto md:mx-0">
              Bridge the gap between academic theory and industrial innovation. Our mentored B.Tech pathways empower you with
              elite engineering foundations and high-demand tech skills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center justify-center">
                Apply Now
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/btech/hero.png"
                alt="Students working with a robotic arm"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute bottom-8 left-8 bg-white/70 backdrop-blur-md rounded-lg p-4 flex items-center shadow-xl">
                <div className="bg-[#D97706] p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#331B00]">98%</div>
                  <div className="text-sm text-[#5A4A42]">PLACEMENT RATE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero