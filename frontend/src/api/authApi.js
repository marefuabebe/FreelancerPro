import api from './axiosInstance.js'

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
}

export const adminLogin = async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials)
    return response.data
}

export const register = async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
}

export const logout = async () => {
    const response = await api.post('/auth/logout')
    return response.data
}

export const verifyEmail = async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`)
    return response.data
}

export const resendVerificationEmail = async (email) => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
}

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me')
    return response.data
}

export const getAdminUser = async () => {
    const response = await api.get('/auth/admin/me')
    return response.data
}

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
}

export const resetPassword = async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
}

export const updateUser = async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
}
