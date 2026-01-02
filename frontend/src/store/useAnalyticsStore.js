import { create } from 'zustand'
import * as analyticsApi from '../api/analyticsApi.js'

export const useAnalyticsStore = create((set, get) => ({
  platformStats: null,
  userAnalytics: null,
  loading: false,
  error: null,

  async fetchPlatformStats() {
    set({ loading: true, error: null })
    try {
      const { data } = await analyticsApi.getPlatformStats()
      set({ platformStats: data.data || data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchUserAnalytics(userId) {
    set({ loading: true, error: null })
    try {
      const { data } = await analyticsApi.getUserAnalytics(userId)
      set({ userAnalytics: data.data || data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },
}))
