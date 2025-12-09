import { create } from 'zustand'
import * as proposalApi from '../api/proposalApi.js'

export const useProposalStore = create((set, get) => ({
  proposals: [],
  selected: null,
  loading: false,
  error: null,

  async fetchProposals(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await proposalApi.getProposals(params)
      const items = (data.data || data).items || (data.data || data)
      set({ proposals: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async fetchById(id) {
    const { data } = await proposalApi.getProposalById(id)
    set({ selected: data.data || data })
  },

  async create(payload) {
    set({ loading: true, error: null })
    try {
      // If payload is FormData, axios will automatically set the correct Content-Type
      const config = payload instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};

      const { data } = await proposalApi.createProposal(payload, config)
      const item = data.data || data
      set({ proposals: [item, ...get().proposals], loading: false })
      return item
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  async update(id, payload) {
    const { data } = await proposalApi.updateProposal(id, payload)
    const item = data.data || data
    set({ proposals: get().proposals.map(p => (p.id === id || p._id === id ? item : p)) })
    return item
  },

  async remove(id) {
    await proposalApi.deleteProposal(id)
    set({ proposals: get().proposals.filter(p => (p.id || p._id) !== id) })
  },
}))
