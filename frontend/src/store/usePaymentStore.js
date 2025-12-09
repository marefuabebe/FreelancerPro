import { create } from 'zustand'
import * as paymentApi from '../api/paymentApi.js'

export const usePaymentStore = create((set, get) => ({
  transactions: [],
  paymentMethods: [],
  loading: false,
  error: null,

  async fetchTransactions(params = {}) {
    set({ loading: true, error: null })
    try {
      const { data } = await paymentApi.getTransactions(params)
      const items = (data.data || data).items || (data.data || data)
      set({ transactions: items, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async makePayment(payload) {
    const { data } = await paymentApi.makePayment(payload)
    return data.data || data
  },

  async addPaymentMethod(payload) {
    const { data } = await paymentApi.addPaymentMethod(payload)
    const method = data.data || data
    set({ paymentMethods: [...get().paymentMethods, method] })
    return method
  },

  async requestPayout(payload) {
    const { data } = await paymentApi.requestPayout(payload)
    return data.data || data
  },
}))
