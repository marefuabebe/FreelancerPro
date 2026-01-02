import { create } from 'zustand'
import * as contractApi from '../api/contractApi.js'

export const useContractStore = create((set, get) => ({
  contracts: [],
  selected: null,
  loading: false,
  error: null,

  async fetchContracts(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await contractApi.getContracts(params)
      console.log('Contracts API response:', data)
      // Backend returns paginated response: { data: { items: [...], pagination: {...} } }
      const contracts = data.data?.items || data.items || data.data || data || []
      console.log('Parsed contracts:', contracts)
      set({ contracts: Array.isArray(contracts) ? contracts : [], loading: false })
    } catch (err) {
      console.error('Failed to fetch contracts:', err)
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchById(id) {
    const { data } = await contractApi.getContractById(id)
    set({ selected: data.data || data })
  },

  async update(id, payload) {
    const { data } = await contractApi.updateContract(id, payload)
    const updated = data.data || data
    set({ contracts: get().contracts.map(c => (c.id === id || c._id === id ? updated : c)), selected: updated })
    return updated
  },

  async createMilestone(contractId, payload) {
    const { data } = await contractApi.createMilestone(contractId, payload)
    return data.data || data
  },

  async releasePayment(contractId, milestoneId) {
    const { data } = await contractApi.releasePayment(contractId, milestoneId)
    return data.data || data
  },

  async openDispute(contractId, payload) {
    const { data } = await contractApi.openDispute(contractId, payload)
    return data.data || data
  },
}))
