
import { useAdmissionModal } from '@/contexts/admission-modal-context'

const Swiper = () => {
    const { openModal } = useAdmissionModal()
    const institutions = [
        { name: 'SMU', logo: '/online-mba/image-1.png' },
        { name: 'Amity University', logo: '/online-mba/image-2.png' },
        { name: 'Online Manipal', logo: '/online-mba/image-3.png' },
        { name: 'Jain', logo: '/online-mba/image-4.png' },
        { name: 'Manipal', logo: '/online-mba/image-5.png' },
        { name: 'Shoolini University', logo: '/online-mba/image-6.png' },
        { name: 'UPES', logo: '/online-mba/image-7.png' },
        { name: 'GLA University', logo: '/online-mba/image-8.png' }
    ]
    return (
        <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    1000+ Universities for Your Desired Online Programs
                </h2>
                <p className="text-gray-600 mb-10 text-center">
                    Choose from top-tier institutions offering world-class online education
                </p>
    
                {/* Static University Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
                    {institutions.map((institution, index) => (
                        <div key={index} className="flex flex-col border-1 border-black items-center justify-center p-6  rounded-lg hover:bg-gray-100 transition-colors">
                            <img 
                                src={institution.logo} 
                                alt={institution.name}
                                className="h-27 w-auto object-contain"
                            />
                            <span className="text-sm font-medium text-orange-500 text-center">{institution.name}</span>
                        </div>
                    ))}
                </div>

                {/* Book Call Now Button */}
                <div className="text-center">
                    <button onClick={() => openModal()} className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-lg">
                        Book Call Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Swiper