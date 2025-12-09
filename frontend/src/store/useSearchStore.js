import { create } from 'zustand'
import * as searchApi from '../api/searchApi.js'

export const useSearchStore = create((set, get) => ({
  results: {
    jobs: [],
    users: [],
    proposals: []
  },
  loading: false,
  error: null,
  query: '',

  setQuery(query) {
    set({ query })
  },

  async searchJobs(query, params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await searchApi.searchJobs(query, params)
      const items = (data.data || data).items || (data.data || data)
      set({ 
        results: { ...get().results, jobs: items },
        loading: false 
      })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async searchUsers(query, params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await searchApi.searchUsers(query, params)
      const items = (data.data || data).items || (data.data || data)
      set({ 
        results: { ...get().results, users: items },
        loading: false 
      })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async searchProposals(query, params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await searchApi.searchProposals(query, params)
      const items = (data.data || data).items || (data.data || data)
      set({ 
        results: { ...get().results, proposals: items },
        loading: false 
      })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  clearResults() {
    set({ 
      results: { jobs: [], users: [], proposals: [] },
      query: '',
      error: null 
    })
  },
}))
