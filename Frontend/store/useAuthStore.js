import { create } from 'zustand'
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api/authApi.js'
import { getToken, setToken, clearToken } from '../utils/storage.js'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken() || null,
  loading: false,
  error: null,

  setUser(user) {
    set({ user })
  },

  async login(credentials) {
    set({ loading: true, error: null })
    try {
      const { data } = await loginApi(credentials)
      const { token, user } = data.data || data
      setToken(token)
      set({ token, user, loading: false })
      return user
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  async register(payload) {
    set({ loading: true, error: null })
    try {
      const { data } = await registerApi(payload)
      set({ loading: false })
      return data
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  async logout() {
    try { await logoutApi() } catch {}
    clearToken()
    set({ token: null, user: null })
  },
}))
