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
    const { data } = await proposalApi.createProposal(payload)
    const item = data.data || data
    set({ proposals: [item, ...get().proposals] })
    return item
  },

  async update(id, payload) {
    const { data } = await proposalApi.updateProposal(id, payload)
    const item = data.data || data
    set({ proposals: get().proposals.map(p => (p.id === id || p._id === id ? item : p)) })
    return item
  },
}))
