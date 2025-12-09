import api from './axiosInstance.js'

export const getProfile = () => api.get('/user/profile')
export const updateProfile = (data) => api.put('/user/profile', data)
export const uploadKYC = (data) => api.post('/user/kyc', data)
export const getPortfolio = (userId) => api.get(`/user/${userId}/portfolio`)
export const updatePortfolio = (data) => api.put('/user/portfolio', data)
