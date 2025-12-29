import api from './axiosInstance.js'

export const getPlatformStats = () => api.get('/analytics/platform')
export const getUserAnalytics = (userId) => api.get(`/analytics/user/${userId}`)
export const getAllUsers = (params) => api.get('/admin/users', { params })

// KYC Verification APIs
export const verifyKYC = (userId, data) => api.post(`/admin/kyc/verify/${userId}`, data)
export const getKYCDocuments = (userId) => api.get(`/admin/kyc/verify/${userId}/documents`)
export const getKYCHistory = (userId) => api.get(`/admin/kyc/verify/${userId}/history`)
export const approveKYC = (userId, data) => api.post(`/admin/kyc/verify/${userId}/approve`, data)
export const rejectKYC = (userId, data) => api.post(`/admin/kyc/verify/${userId}/reject`, data)

export const getReports = () => api.get('/admin/reports')
export const getProposals = () => api.get('/admin/proposals');
export const updateUserStatus = (userId, data) => api.patch(`/admin/users/${userId}/status`, data)
export const getAdminJobs = (params) => api.get('/admin/jobs', { params })
export const updateJobStatus = (jobId, data) => api.patch(`/admin/jobs/${jobId}/status`, data)
export const getAdminContracts = (params) => api.get('/admin/contracts', { params })
export const getAdminTransactions = (params) => api.get('/admin/transactions', { params })
export const getAdminDisputes = (params) => api.get('/admin/disputes', { params })
