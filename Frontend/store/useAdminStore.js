import { create } from 'zustand'
import * as adminApi from '../api/adminApi.js'

export const useAdminStore = create((set) => ({
  platformStats: null,
  userStats: null,
  loading: false,
  error: null,

  async loadPlatformStats() {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getPlatformStats()
      set({ platformStats: data.data || data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async loadUserStats(userId) {
    const { data } = await adminApi.getUserAnalytics(userId)
    set({ userStats: data.data || data })
  },
}))
