import React from 'react'

const Features = () => {
  const features = [
    {
      icon: '🎓',
      title: 'Industry-Ready Curriculum',
      description: 'Our B.Tech programs are designed with input from leading tech companies to ensure you graduate with the most in-demand skills and knowledge.'
    },
    {
      icon: '👨‍💼',
      title: '100% Placement Support',
      description: 'Dedicated placement cell with 98% placement rate. Connect with top recruiters and get your dream job.'
    },
    {
      icon: '🌍',
      title: 'Global Recognition',
      description: 'Degrees recognized worldwide by leading universities and employers. Study with international credibility.'
    },
    {
      icon: '💻',
      title: 'Hands-on Learning',
      description: 'Practical training with real-world projects, internships, and industry exposure.'
    },
    {
      icon: '🏆',
      title: 'Expert Faculty',
      description: 'Learn from experienced professors and industry experts with decades of combined expertise.'
    },
    {
      icon: '🔬',
      title: 'Modern Labs & Infrastructure',
      description: 'State-of-the-art laboratories, equipment, and facilities for practical learning.'
    },
    {
      icon: '📚',
      title: 'Flexible Learning Options',
      description: 'Online, offline, and hybrid learning modes to suit your schedule and learning style.'
    }
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Our B.Tech Programs?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features