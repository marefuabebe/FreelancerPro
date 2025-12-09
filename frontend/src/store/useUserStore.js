import { create } from 'zustand'
import * as userApi from '../api/userApi.js'

export const useUserStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  async loadProfile() {
    set({ loading: true, error: null })
    try {
      const { data } = await userApi.getProfile()
      set({ profile: data.data || data, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async updateProfile(payload) {
    const profile = get().profile;
    if (!profile?.id) return;
    const { data } = await userApi.updateProfile(profile.id, payload)
    set({ profile: data.data || data })
  },
}))
