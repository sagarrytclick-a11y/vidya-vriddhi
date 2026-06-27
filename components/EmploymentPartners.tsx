'use client'

import { useState, useEffect } from 'react'

const EmploymentPartners = () => {
    const partners = [
        { name: 'Amazon', logo: '/online-mba/amazon.png' },
        { name: 'Microsoft', logo: '/online-mba/microsoft.png' },
        { name: 'Google', logo: '/online-mba/google.png' },
        { name: 'myntra', logo: '/online-mba/myntra.png' },
        { name: 'makemytrip', logo: '/online-mba/makemytrip.png' },
        { name: 'accenture', logo: '/online-mba/accenture.png' },
        { name: 'cisco', logo: '/online-mba/cisco.png' },
        { name: 'paytm', logo: '/online-mba/paytm.png' },
        { name: 'flipkart', logo: '/online-mba/flipkart.png' },
        { name: 'tcs', logo: '/online-mba/tcs.png' },
    ];

    // Duplicate partners for infinite scroll effect
    const duplicatedPartners = [...partners, ...partners];

    return (
        <div className="bg-gray-50 py-16 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    Trusted by 100+ Academic & Employment Partners
                </h2>
                <p className="text-gray-600 mb-12 text-center">
                    Our graduates work at leading companies worldwide
                </p>
    
                {/* Auto Sliding Carousel */}
                <div className="relative">
                    <div className="flex animate-slide">
                        {duplicatedPartners.map((partner, index) => (
                            <div key={index} className="flex-shrink-0 w-1/2 md:w-1/4 px-4">
                                <div className="flex items-center justify-center p-6 bg-white rounded-lg h-24">
                                    <img 
                                        src={partner.logo} 
                                        alt={partner.name}
                                        className="h-25 w-auto object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes slide {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .animate-slide {
                    animation: slide 10s linear infinite;
                }
                
                .animate-slide:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}

export default EmploymentPartners;
