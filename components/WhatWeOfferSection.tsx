import { useAdmissionModal } from '@/contexts/admission-modal-context'

const WhatWeOfferSection = () => {
    const { openModal } = useAdmissionModal()
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-8">What we Offer?</h2>
          <ul className="space-y-4">
            <li className="flex items-center text-lg text-gray-700">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Personalized counselling with right information
            </li>
            <li className="flex items-center text-lg text-gray-700">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Answers related to Your Degree
            </li>
            <li className="flex items-center text-lg text-gray-700">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Assistance to Get the Right University
            </li>
            <li className="flex items-center text-lg text-gray-700">
              <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Guidance from Experts
            </li>
          </ul>
          <button onClick={() => openModal()} className="bg-orange-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-orange-600 text-lg font-semibold mt-8">
            Book Call Now
          </button>
        </div>
        <div className="flex justify-center">
          <img 
            src="https://i.pinimg.com/1200x/72/11/af/7211af4a0cb44d9fcae0d4eea1b8e7d1.jpg" 
            alt="Students group"
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
      </div>
    </div>
  )
}

export default WhatWeOfferSection
