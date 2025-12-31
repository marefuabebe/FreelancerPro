import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FeatureCards() {
    const [activeTab, setActiveTab] = useState('hiring')

    const features = {
        hiring: [
            {
                title: 'Posting jobs is always free',
                description: 'Generate a job post with AI or create your own and filter talent matches.',
                image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-green-50',
                cta: 'Create a job',
                link: '/nx/job-post/draft'
            },
            {
                title: 'Get proposals and hire',
                description: 'Screen, interview or book a consult with an expert before hiring.',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-orange-50',
                cta: 'Explore experts',
                link: '/nx/search/talent'
            },
            {
                title: 'Pay when work is done',
                description: 'Release payments after approving work, by milestone or upon project completion.',
                image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-blue-50',
                cta: 'View pricing',
                link: '/pricing'
            }
        ],
        freelancing: [
            {
                title: 'Create a profile',
                description: 'Highlight your skills and experience to attract top clients.',
                image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-purple-50',
                cta: 'Create a profile',
                link: '/signup'
            },
            {
                title: 'Search for jobs',
                description: 'Find work that matches your skills and interests.',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-yellow-50',
                cta: 'Search for jobs',
                link: '/nx/find-work/best-matches'
            },
            {
                title: 'Get paid securely',
                description: 'Receive payment securely and on time for your work.',
                image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                color: 'bg-red-50',
                cta: 'See how it works',
                link: '/about'
            }
        ]
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 md:mb-0">How it works</h2>

                <div className="flex bg-white rounded-full p-1 border border-gray-200">
                    <button
                        onClick={() => setActiveTab('hiring')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'hiring'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        For hiring
                    </button>
                    <button
                        onClick={() => setActiveTab('freelancing')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'freelancing'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        For finding work
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features[activeTab].map((feature) => (
                    <div key={feature.title} className="group cursor-pointer">
                        <div className={`rounded-2xl overflow-hidden mb-6 aspect-[4/3] ${feature.color}`}>
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {feature.description}
                        </p>
                        <Link
                            to={feature.link}
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        >
                            {feature.cta}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}
