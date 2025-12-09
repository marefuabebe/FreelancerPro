import api from './axiosInstance.js'

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/signup', data)
export const logout = () => api.post('/auth/logout')
export const verifyEmail = (token) => api.get(`/auth/verify-email?token=${token}`)
export const forgotPassword = (data) => api.post('/auth/forgot-password', data)
export const resetPassword = (data) => api.post('/auth/reset-password', data)
