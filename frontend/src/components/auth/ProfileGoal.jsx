import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'
import { toast } from 'react-toastify'

export default function ProfileGoal() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [selectedGoal, setSelectedGoal] = useState('')

    const goalOptions = [
        {
            id: 'main_income',
            title: 'To earn my main income',
            description: 'Different people come to FreelancerPro for various reasons. We want to highlight the opportunities that fit your goals best while still showing you all the possibilities.',
            icon: (
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {/* Money bag icon like Upwork */}
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.5 2 6 4.5 6 8v1H4v2h2v1c0 3.5 2.5 6 6 6s6-2.5 6-6v-1h2V9h-2V8c0-3.5-2.5-6-6-6z" fill="#F59E0B" />
                        <circle cx="12" cy="12" r="2" fill="#8B5CF6" />
                        <path d="M8 6h8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            )
        },
        {
            id: 'side_income',
            title: 'To make money on the side',
            description: 'Different people come to FreelancerPro for various reasons. We want to highlight the opportunities that fit your goals best while still showing you all the possibilities.',
            icon: (
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {/* Hand with money icon like Upwork */}
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.5 2 6 4.5 6 8v1H4v2h2v1c0 3.5 2.5 6 6 6s6-2.5 6-6v-1h2V9h-2V8c0-3.5-2.5-6-6-6z" fill="#10B981" />
                        <path d="M8 6h8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="1" fill="#8B5CF6" />
                    </svg>
                </div>
            )
        },
        {
            id: 'experience',
            title: 'To get experience, for a full-time job',
            description: 'Different people come to FreelancerPro for various reasons. We want to highlight the opportunities that fit your goals best while still showing you all the possibilities.',
            icon: (
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {/* Medal icon like Upwork */}
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" fill="#F59E0B" />
                        <circle cx="12" cy="12" r="3" fill="#10B981" />
                        <path d="M12 9v3l2 1" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )
        },
        {
            id: 'no_goal',
            title: 'I don\'t have a goal in mind yet',
            description: 'Different people come to FreelancerPro for various reasons. We want to highlight the opportunities that fit your goals best while still showing you all the possibilities.',
            icon: (
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {/* Phone with magnifying glass icon like Upwork */}
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" fill="#10B981" />
                        <path d="M8 2v4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 2v4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="3" fill="#8B5CF6" />
                        <path d="m21 21-4.35-4.35" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )
        }
    ]

    const handleNext = () => {
        if (!selectedGoal) {
            toast.error('Please select your freelancing goal')
            return
        }

        // Store the goal in localStorage for the flow
        localStorage.setItem('onboarding_goal', selectedGoal)
        navigate('/nx/create-profile/work-preference')
    }

    const handleBack = () => {
        navigate('/nx/create-profile/experience-level')
    }

    const handleSkip = () => {
        navigate('/nx/create-profile/work-preference')
    }

    return (
        <div className="h-[calc(100vh-65px)] bg-white relative flex flex-col overflow-hidden">
            {/* Top logo removed; global OnboardingNavbar renders header */}

            {/* Main onboarding content */}
            <div className="flex-1 w-full overflow-y-auto flex flex-col">
                <div className="w-full flex flex-col items-center my-auto px-6 py-4">
                    {/* Progress indicator */}
                    <div className="w-full max-w-7xl flex flex-col mb-4">
                        <div className="flex items-center text-gray-500 text-lg font-medium mb-2" style={{ letterSpacing: '0.02em' }}>
                            <span>2/3</span>
                        </div>
                        <div className="w-full h-[4px] rounded bg-gray-200 mb-4">
                            <div className="h-full bg-green-600 rounded" style={{ width: '66%' }} />
                        </div>
                    </div>
                    {/* Content card */}
                    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
                        {/* Left: Main goal selection */}
                        <div className="flex-1 min-w-[300px]">
                            {/* Content card */}
                            <div className="w-full max-w-7xl mx-auto">

                                {/* Main content */}
                                <div className="text-center mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Got it. What's your biggest goal for freelancing?
                                    </h1>
                                    <p className="text-base text-gray-600 max-w-3xl mx-auto">
                                        Different people come to FreelancerPro for various reasons. We want to highlight the opportunities that fit your goals best while still showing you all the possibilities.
                                    </p>
                                </div>

                                {/* Goal options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    {goalOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => setSelectedGoal(option.id)}
                                            className={`relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedGoal === option.id
                                                ? 'border-green-500 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {/* Radio button */}
                                            <div className="absolute top-4 right-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedGoal === option.id
                                                    ? 'border-green-500 bg-green-500'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    {selectedGoal === option.id && (
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Icon */}
                                            <div className="flex justify-center mb-4">
                                                {option.icon}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base font-semibold text-gray-900 text-center mb-1">
                                                {option.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-gray-600 text-center">
                                                {option.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation buttons row */}
                                <div className="flex flex-row items-center justify-between w-full mt-4 gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            className="text-lg px-6 text-green-600 bg-white border-0 hover:underline transition-colors"
                                            tabIndex={-1}
                                        >
                                            Skip for now
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="h-12 px-10 text-lg rounded-[28px] bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}