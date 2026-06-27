const StatisticsSection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
            <div className="text-lg font-semibold text-gray-700">Universities</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">4.9/5</div>
            <div className="text-lg font-semibold text-gray-700">Learner's Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">7K+</div>
            <div className="text-lg font-semibold text-gray-700">Learners Enrolled</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsSection
