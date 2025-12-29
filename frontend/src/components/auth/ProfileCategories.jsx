import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORY_LIST = [
    'Accounting & Consulting',
    'Admin Support',
    'Customer Service',
    'Data Science & Analytics',
    'Design & Creative',
    'Engineering & Architecture',
    'IT & Networking',
    'Legal',
    'Sales & Marketing',
    'Translation',
    'Web, Mobile & Software Dev',
    'Writing'
]

const CATEGORY_TO_SPECIALTIES = {
    'Accounting & Consulting': [
        'Personal & Professional Coaching',
        'Accounting & Bookkeeping',
        'Financial Planning',
        'Recruiting & Human Resources',
        'Management Consulting & Analysis',
        'Other - Accounting & Consulting',
    ],
    'Admin Support': [
        'Data Entry', 'Project Management', 'Virtual Assistance', 'Transcription', 'Other - Admin Support'
    ],
    'Customer Service': [
        'Customer Support', 'Technical Support', 'Phone Support', 'Email & Chat Support'
    ],
    'Data Science & Analytics': [
        'Data Extraction/ETL', 'Data Visualization', 'Machine Learning', 'A/B Testing'
    ],
    'Design & Creative': [
        'Graphic Design', 'Logo Design & Branding', 'Presentation Design', 'Video Editing'
    ],
    'Engineering & Architecture': [
        '3D Modeling & CAD', 'Civil & Structural Engineering', 'Mechanical Engineering'
    ],
    'IT & Networking': [
        'DevOps & Sysadmin', 'Network & System Administration', 'Information Security'
    ],
    'Legal': [
        'Contract Law', 'Intellectual Property Law', 'Paralegal Services'
    ],
    'Sales & Marketing': [
        'Lead Generation', 'Search Engine Marketing', 'Social Media Marketing'
    ],
    'Translation': [
        'General Translation', 'Localization', 'Subtitling'
    ],
    'Web, Mobile & Software Dev': [
        'Frontend Development', 'Backend Development', 'Full Stack Development', 'Mobile App Development'
    ],
    'Writing': [
        'Article & Blog Writing', 'Copywriting', 'Technical Writing', 'Editing & Proofreading'
    ]
}

export default function ProfileCategories() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(CATEGORY_LIST[0])
    const [specialties, setSpecialties] = useState([])
    const maxSpecialties = 3
    const [showError, setShowError] = useState(false)

    const toggleSpecialty = (name) => {
        setSpecialties((prev) => {
            if (prev.includes(name)) {
                const next = prev.filter((s) => s !== name)
                if (next.length > 0) setShowError(false)
                return next
            }
            if (prev.length >= maxSpecialties) return prev
            const next = [...prev, name]
            if (next.length > 0) setShowError(false)
            return next
        })
    }

    const handleCategory = (c) => {
        setSelected(c)
        setSpecialties([])
        setShowError(false)
    }

    const hasValidSelection = selected && specialties.length >= 1 && specialties.length <= maxSpecialties

    const handleNext = () => {
        if (!hasValidSelection) {
            setShowError(true)
            return
        }
        localStorage.setItem('onboarding_category', selected)
        localStorage.setItem('onboarding_specialties', JSON.stringify(specialties))
        navigate('/nx/create-profile/skills')
    }

    const list = CATEGORY_TO_SPECIALTIES[selected] || []

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="text-sm text-gray-600 mb-4">2/10</div>
                <div className="w-full h-1 bg-gray-200 rounded mb-8">
                    <div className="h-full bg-gray-400 rounded" style={{ width: '20%' }} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Great, so what kind of work are you here to do?</h1>
                <p className="text-gray-600 mb-8">Don't worry, you can change these choices later on.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="text-sm text-gray-600 mb-3">Select 1 category</div>
                        <div className="divide-y border rounded">
                            {CATEGORY_LIST.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleCategory(c)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selected === c ? 'bg-green-50 border-l-4 border-l-green-500 text-green-700 font-medium' : ''}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-600 mb-3">Now, select 1 to 3 specialties</div>
                        <div className="space-y-4">
                            {list.map((s) => (
                                <label key={s} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={specialties.includes(s)}
                                        onChange={() => toggleSpecialty(s)}
                                        className="w-5 h-5"
                                    />
                                    <span className="text-gray-900">{s}</span>
                                </label>
                            ))}
                            {showError && specialties.length === 0 && (
                                <div className="text-red-600 flex items-center gap-2">
                                    <span className="text-lg">!</span>
                                    <span>You must select at least one service.</span>
                                </div>
                            )}
                            {specialties.length > 0 && (
                                <div className="pt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setSpecialties([]); setShowError(false) }}
                                        className="inline-flex items-center gap-2 text-green-600 hover:underline"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#16a34a" d="M3 6h18v2H3zM7 10h10v2H7zM10 14h4v2h-4z" /></svg>
                                        Clear selections
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-between">
                    <button type="button" onClick={() => navigate('/nx/create-profile/upload')} className="h-12 px-8 rounded-[28px] border border-gray-300 font-bold text-green-700 hover:bg-gray-50">Back</button>
                    <button type="button" onClick={handleNext} className={`h-12 px-8 rounded-[28px] text-white bg-green-600 hover:bg-green-700`}>Next, add your skills</button>
                </div>
            </div>
        </div>
    )
}


