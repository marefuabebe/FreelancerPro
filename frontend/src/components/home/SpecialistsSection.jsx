import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchFreelancers } from '../../api/searchApi'

export default function SpecialistsSection({ selectedCategory, onClose }) {
    const [specialists, setSpecialists] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (selectedCategory) {
            fetchSpecialists()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])

    const fetchSpecialists = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await searchFreelancers({
                category: selectedCategory,
                limit: 12,
                sortBy: 'rating.average',
                sortOrder: 'desc'
            })
            console.log('API Response:', response)
            // Handle different response structures
            const freelancers = response?.data?.freelancers || response?.data?.data?.freelancers || []
            setSpecialists(freelancers)
        } catch (err) {
            console.error('Error fetching specialists:', err)
            setError('Failed to load specialists. Please try again.')
            setSpecialists([])
        } finally {
            setLoading(false)
        }
    }

    if (!selectedCategory) return null

    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Top {selectedCategory} Specialists
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Browse skilled professionals in {selectedCategory}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="mt-4 text-gray-600">Loading specialists...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {specialists.map((specialist) => (
                                <div
                                    key={specialist._id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={specialist.avatar?.url || `https://ui-avatars.com/api/?name=${specialist.firstName}+${specialist.lastName}&background=10b981&color=fff`}
                                            alt={`${specialist.firstName} ${specialist.lastName}`}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {specialist.firstName} {specialist.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {specialist.professionalTitle || 'Freelancer'}
                                            </p>

                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(specialist.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {specialist.rating?.average?.toFixed(1) || '0.0'} on avg.
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${specialist.hourlyRate || 0}/hr+
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {specialist.completedJobs || 0} jobs completed
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {(specialist.skills || []).slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-4">
                                                <Link
                                                    to={`/freelancers/${specialist._id}`}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center block"
                                                >
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {specialists.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No specialists found</h3>
                                <p className="text-gray-600">We're working on adding more specialists in this category.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
