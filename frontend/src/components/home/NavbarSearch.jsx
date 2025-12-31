import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NavbarSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedType, setSelectedType] = useState('Talent')
    const [query, setQuery] = useState('')
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const searchTypes = [
        {
            id: 'talent', label: 'Talent', icon: (
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ), description: 'Hire professionals and agencies'
        },
        {
            id: 'projects', label: 'Projects', icon: (
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ), description: 'Buy ready-to-start services'
        },
        {
            id: 'jobs', label: 'Jobs', icon: (
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ), description: 'Apply to jobs posted by clients'
        },
    ]

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return

        // Redirect based on selected type
        if (selectedType === 'Talent') {
            navigate(`/nx/search/talent?q=${encodeURIComponent(query)}`)
        } else if (selectedType === 'Jobs') {
            navigate(`/nx/find-work/best-matches?search=${encodeURIComponent(query)}`)
        } else if (selectedType === 'Projects') {
            // Placeholder: redirect to jobs for now as Projects route doesn't exist
            navigate(`/nx/find-work/best-matches?search=${encodeURIComponent(query)}&type=project`)
        }
        setIsOpen(false)
    }

    return (
        <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center h-10 px-4 border border-r-0 border-gray-300 rounded-l-full hover:bg-gray-50 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:z-10"
                    >
                        {selectedType}
                        <svg className={`ml-2 h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                            {searchTypes.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedType(type.label)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-3 flex items-start hover:bg-gray-50 ${selectedType === type.label ? 'bg-green-50' : ''}`}
                                >
                                    <div className="mt-1">{type.icon}</div>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">{type.label}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="block w-full h-10 pl-10 pr-4 border border-gray-300 rounded-r-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        placeholder="Search"
                    />
                </div>
            </form>
        </div>
    )
}
