import { create } from 'zustand'
import * as jobApi from '../api/jobApi.js'

export const useJobStore = create((set, get) => ({
  jobs: [],
  total: 0,
  selectedJob: null,
  loading: false,
  error: null,

  async fetchJobs(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await jobApi.getJobs(params)
      const payload = data.data || data
      set({ jobs: payload.items || payload, total: payload.total || payload.length || 0, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchJobById(id) {
    set({ loading: true, error: null })
    try {
      const { data } = await jobApi.getJobById(id)
      const job = data.data || data
      set({ selectedJob: job, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async createJob(payload) {
    const { data } = await jobApi.createJob(payload)
    const responseData = data.data || data

    // Handle both old and new response formats
    const job = responseData.job || responseData
    const user = responseData.user

    if (user) {
      // Update auth store if user data is returned
      const { useAuthStore } = await import('./useAuthStore.js')
      useAuthStore.getState().setUser(user)
    }

    set({ jobs: [job, ...get().jobs] })
    return job
  },

  async updateJob(id, payload) {
    const { data } = await jobApi.updateJob(id, payload)
    const updated = data.data || data
    set({ jobs: get().jobs.map(j => (j.id === id || j._id === id ? updated : j)) })
    return updated
  },

  async deleteJob(id) {
    await jobApi.deleteJob(id)
    set({ jobs: get().jobs.filter(j => (j.id || j._id) !== id) })
  },
}))
