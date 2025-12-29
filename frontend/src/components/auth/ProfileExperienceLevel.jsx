import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore.js'
import { toast } from 'react-toastify'

export default function ProfileExperienceLevel() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [selectedLevel, setSelectedLevel] = useState('')

    const levelOptions = [
        {
            id: 'brand_new',
            title: 'I am brand new to this',
            description: 'I have never freelanced before.',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#10B981" />
                        <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )
        },
        {
            id: 'some_experience',
            title: 'I have some experience',
            description: 'I have done some freelancing work before.',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )
        },
        {
            id: 'expert',
            title: 'I am an expert',
            description: 'I have been freelancing for a long time.',
            icon: (
                <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F59E0B" />
                    </svg>
                </div>
            )
        }
    ]

    const handleNext = () => {
        if (!selectedLevel) {
            toast.error('Please select your experience level')
            return
        }

        // Store the level in localStorage for the flow
        localStorage.setItem('onboarding_experience_level', selectedLevel)
        navigate('/nx/create-profile/goal')
    }

    const handleSkip = () => {
        navigate('/nx/create-profile/goal')
    }

    return (
        <div className="h-[calc(100vh-65px)] bg-white relative flex flex-col overflow-hidden">
            {/* Main onboarding content */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 w-full">
                {/* Progress indicator */}
                <div className="w-full max-w-5xl flex flex-col mb-6">
                    <div className="flex items-center text-gray-500 text-lg font-medium mb-2" style={{ letterSpacing: '0.02em' }}>
                        <span>1/3</span>
                    </div>
                    <div className="w-full h-[4px] rounded bg-gray-200 mb-4">
                        <div className="h-full bg-green-600 rounded" style={{ width: '33%' }} />
                    </div>
                </div>
                {/* Content card */}
                <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
                    {/* Left: Main selection */}
                    <div className="flex-1 min-w-[300px]">
                        {/* Content card */}
                        <div className="w-full max-w-5xl mx-auto">

                            {/* Main content */}
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    A few quick questions: have you freelanced before?
                                </h1>
                                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                    This lets us know how much help to give you along the way. We won't share your answer with anyone else, including potential clients.
                                </p>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {levelOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => setSelectedLevel(option.id)}
                                        className={`relative bg-white rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedLevel === option.id
                                            ? 'border-green-500 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Radio button */}
                                        <div className="absolute top-4 right-4">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedLevel === option.id
                                                ? 'border-green-500 bg-green-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedLevel === option.id && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className="flex justify-center mb-4">
                                            {option.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                            {option.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 text-center">
                                            {option.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation buttons row */}
                            <div className="flex flex-row items-center justify-between w-full mt-8 gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/nx/create-profile')}
                                    className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50 transition-colors"
                                >
                                    Back
                                </button>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleSkip}
                                        className="text-lg px-6 text-green-600 bg-white border-0 hover:underline transition-colors"
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
    )
}
