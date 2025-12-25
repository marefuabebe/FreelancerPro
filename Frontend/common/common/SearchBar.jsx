import { useState, useEffect } from 'react'
import { useSearchStore } from '../../store/useSearchStore.js'

export default function SearchBar({ onResultSelect, placeholder = "Search jobs, users, proposals..." }) {
  const { query, setQuery, searchJobs, searchUsers, searchProposals, loading, results } = useSearchStore()
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        searchJobs(query)
        searchUsers(query)
        searchProposals(query)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [query, searchJobs, searchUsers, searchProposals])

  const handleSelect = (item, type) => {
    if (onResultSelect) {
      onResultSelect(item, type)
    }
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {showResults && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto mt-1">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {results.jobs.length > 0 && (
            <div className="p-2">
              <h4 className="font-semibold text-sm text-gray-700 px-2 py-2 border-b border-gray-100">Jobs</h4>
              {results.jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id || job._id}
                  onClick={() => handleSelect(job, 'job')}
                  className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900">{job.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{job.description?.substring(0, 60)}...</div>
                  <div className="text-xs text-green-600 font-medium mt-1">${typeof job.budget === 'object' && job.budget?.amount ? job.budget.amount : (job.budget || 'TBD')}</div>
                </div>
              ))}
            </div>
          )}

          {results.users.length > 0 && (
            <div className="p-2">
              <h4 className="font-semibold text-sm text-gray-700 px-2 py-2 border-b border-gray-100">Users</h4>
              {results.users.slice(0, 3).map((user) => (
                <div
                  key={user.id || user._id}
                  onClick={() => handleSelect(user, 'user')}
                  className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900">{user.name || user.email}</div>
                  <div className="text-xs text-gray-600 mt-1">{user.role}</div>
                </div>
              ))}
            </div>
          )}

          {results.proposals.length > 0 && (
            <div className="p-2">
              <h4 className="font-semibold text-sm text-gray-700 px-2 py-2 border-b border-gray-100">Proposals</h4>
              {results.proposals.slice(0, 3).map((proposal) => (
                <div
                  key={proposal.id || proposal._id}
                  onClick={() => handleSelect(proposal, 'proposal')}
                  className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900">Proposal for {proposal.jobTitle}</div>
                  <div className="text-xs text-green-600 font-medium mt-1">${typeof proposal.budget === 'object' && proposal.budget?.amount ? proposal.budget.amount : (proposal.budget || 'TBD')}</div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.jobs.length === 0 && results.users.length === 0 && results.proposals.length === 0 && query.length > 2 && (
            <div className="p-4 text-center text-gray-500">
              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
