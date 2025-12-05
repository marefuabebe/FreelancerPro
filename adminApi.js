import api from './axiosInstance.js'

export const getPlatformStats = () => api.get('/analytics/platform-stats')
export const getUserAnalytics = (userId) => api.get(`/analytics/user/${userId}`)
export const getReports = () => api.get('/admin/reports')
