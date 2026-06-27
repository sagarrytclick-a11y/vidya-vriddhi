
import { useAdmissionModal } from '@/contexts/admission-modal-context'

const Onlinehero = () => {
  const { openModal } = useAdmissionModal()
  return (
    <div className="relative bg-linear-to-br from-orange-50 to-white py-20 overflow-hidden border-b border-orange-200">
      <div className="absolute inset-0 w-full h-full opacity-10">
        <div className="absolute inset-0 bg-linear-to-r from-white to-transparent z-10" />
        <img
          src="/online-mba/online-hero.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-5xl font-bold leading-tight mb-4 text-gray-900">
            India's Leading Platform for <span className="text-[#EF7D31]">Online MBA Discovery</span>
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Compare top-tier institutions and save up to 30% on enrollment fees through our exclusive 2026 partner network.
          </p>
          <button onClick={() => openModal()} className="bg-[#EF7D31] hover:bg-[#f66505] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-orange-500/20">
            Explore Programs
          </button>
        </div>

        <div className="relative w-full md:w-1/2 h-80 rounded-2xl overflow-hidden border border-orange-200 shadow-2xl">
          <img
            src="/online-mba/online-hero.png" 
            alt="Online Learning"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Onlinehero