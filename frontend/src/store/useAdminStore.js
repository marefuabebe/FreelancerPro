import { create } from 'zustand'
import * as adminApi from '../api/adminApi.js'

export const useAdminStore = create((set, get) => ({
  platformStats: null,
  userStats: null,
  users: [],
  jobs: [],
  contracts: [],
  transactions: [],
  disputes: [],
  proposals: [],
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

  async fetchUsers(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getAllUsers(params)
      const items = (data.data || data).items || (data.data || data)
      set({ users: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async verifyKYC(userId, data) {
    const result = await adminApi.verifyKYC(userId, data)
    return result.data || result
  },

  async updateUserStatus(userId, statusData) {
    const result = await adminApi.updateUserStatus(userId, statusData)
    return result.data || result
  },

  async fetchAdminJobs(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getAdminJobs(params)
      const items = (data.data || data).items || (data.data || data)
      set({ jobs: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async updateJobStatus(jobId, status) {
    const result = await adminApi.updateJobStatus(jobId, { status })
    return result.data || result
  },

  async fetchAdminContracts(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getAdminContracts(params)
      const items = (data.data || data).items || (data.data || data)
      set({ contracts: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchAdminTransactions(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getAdminTransactions(params)
      const items = (data.data || data).items || (data.data || data)
      set({ transactions: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchAdminDisputes(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getAdminDisputes(params)
      const items = (data.data || data).items || (data.data || data)
      set({ disputes: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchProposals(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await adminApi.getProposals(params)
      const items = (data.data || data).proposals || (data.data || data)
      set({ proposals: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },
  async updateSettings(settings) {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Settings updated:', settings);
    return { success: true };
  },
}))
