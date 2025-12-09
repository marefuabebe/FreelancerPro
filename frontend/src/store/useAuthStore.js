import { create } from 'zustand'
import { login as loginApi, register as registerApi, logout as logoutApi, verifyEmail as verifyEmailApi, resendVerificationEmail, getCurrentUser, getAdminUser } from '../api/authApi.js'
import { getToken, setToken, clearToken } from '../utils/storage.js'
import { clearOnboardingData } from '../utils/onboardingUtils.js'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken() || null,
  loading: !!getToken(),
  error: null,
  emailVerificationSent: false,
  pendingEmail: null,
  verificationRequired: false,
  resendVerificationLoading: false,

  async init() {
    const token = getToken()
    if (token) {
      set({ loading: true })
      try {
        const { data } = await getCurrentUser()
        const user = data.data || data
        set({ user, token, loading: false })
      } catch (error) {
        // Try fetching admin user
        try {
          const { data } = await getAdminUser()
          const user = data.data || data
          set({ user, token, loading: false })
        } catch (adminError) {
          console.error('Failed to fetch user or admin:', error)
          clearToken()
          set({ user: null, token: null, loading: false })
        }
      }
    }
  },

  setUser(user) {
    console.log('🔧 Setting user in store:', user)
    set({ user })
  },

  setTokenInStore(token) {
    console.log('🔧 Setting token in store:', token ? 'Token exists' : 'No token')
    if (token) {
      setToken(token)
      set({ token })
    }
  },

  setEmailVerificationSent(email) {
    set({ emailVerificationSent: true, pendingEmail: email })
  },

  clearEmailVerificationState() {
    set({ emailVerificationSent: false, pendingEmail: null, verificationRequired: false })
  },

  async login(credentials) {
    set({ loading: true, error: null })
    try {
      const { data } = await loginApi(credentials)
      const { token, user } = data.data || data
      setToken(token)
      set({ token, user, loading: false, emailVerificationSent: false, pendingEmail: null, verificationRequired: false })
      return user
    } catch (err) {
      const verificationRequired = err.response?.data?.errors?.verificationRequired
      if (verificationRequired) {
        set({
          error: err.response?.data?.message || 'Please verify your email to continue',
          loading: false,
          verificationRequired: true,
          pendingEmail: credentials.email,
          emailVerificationSent: false,
        })
      } else {
        set({ error: err.response?.data?.message || err.message, loading: false, verificationRequired: false })
      }
      throw err
    }
  },

  async loginAdmin(credentials) {
    set({ loading: true, error: null })
    try {
      // Import dynamically to avoid circular dependency if any, or just use the imported one
      const { adminLogin } = await import('../api/authApi.js')
      const { data } = await adminLogin(credentials)
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
      set({ loading: false, emailVerificationSent: true, pendingEmail: payload.email, verificationRequired: true })
      return data
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  async verifyEmail(token) {
    set({ loading: true, error: null })
    try {
      console.log('🔍 Calling verifyEmail API with token:', token)
      const { data } = await verifyEmailApi(token)
      console.log('🔍 API response:', data)

      set({ loading: false })
      return data

      return data
    } catch (err) {
      console.error('❌ Verification API error:', err)
      set({ error: err.response?.data?.message || err.message, loading: false })
      throw err
    }
  },

  async resendVerification(email) {
    const targetEmail = email || get().pendingEmail
    if (!targetEmail) {
      set({ error: 'No email available for verification' })
      throw new Error('No email available for verification')
    }
    set({ resendVerificationLoading: true, error: null })
    try {
      await resendVerificationEmail({ email: targetEmail })
      set({
        resendVerificationLoading: false,
        emailVerificationSent: true,
        pendingEmail: targetEmail,
        verificationRequired: true,
      })
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        resendVerificationLoading: false,
      })
      throw err
    }
  },

  async logout() {
    try { await logoutApi() } catch { }
    clearToken()
    set({ token: null, user: null, emailVerificationSent: false, pendingEmail: null, verificationRequired: false })
  },
}))
