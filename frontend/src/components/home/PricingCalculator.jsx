import { useState } from 'react'
import { usePricingCalculator } from '../../hooks/usePricingCalculator.js'

export default function PricingCalculator() {
  const [description, setDescription] = useState('')
  const { calculatePricing, isCalculating, estimate, error } = usePricingCalculator()

  const handleCalculate = async () => {
    await calculatePricing(description)
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-3xl overflow-hidden p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Get insights into freelancer pricing
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                We'll calculate the average cost for freelancers with the skills you need.
              </p>

              <div className="bg-white rounded-2xl p-2 flex items-center shadow-lg">
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="To start, describe what you need done."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 px-4 py-3 text-lg focus:outline-none min-w-0"
                />
                <button
                  onClick={handleCalculate}
                  disabled={!description.trim() || isCalculating}
                  className="bg-gray-900 hover:bg-black disabled:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shrink-0"
                >
                  {isCalculating ? 'Calculating...' : 'Next'}
                  {!isCalculating && (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {estimate && (
                <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Cost estimate</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Affordable</span>
                      <span className="text-green-400 font-semibold">${estimate.affordable}/hr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Typical</span>
                      <span className="text-white font-semibold">${estimate.typical}/hr</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Expert</span>
                      <span className="text-blue-400 font-semibold">${estimate.expert}/hr</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative hidden lg:flex justify-center items-center h-full min-h-[400px]">
              {/* Glow Effect */}
              <div className="absolute w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>

              {/* Button Visual */}
              <div className="relative z-10">
                <div className="bg-black border border-green-500/50 text-white px-8 py-4 rounded-full text-xl font-medium shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  Describe your job
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
