import api from './axiosInstance.js'

export const getContracts = (params) => api.get('/contracts', { params })
export const getContractById = (id) => api.get(`/contracts/${id}`)
export const updateContract = (id, data) => api.put(`/contracts/${id}`, data)

export const createMilestone = (contractId, data) => api.post(`/contracts/${contractId}/milestones`, data)
export const releasePayment = (contractId, milestoneId) => api.post(`/contracts/${contractId}/milestones/${milestoneId}/release`)
export const openDispute = (contractId, data) => api.post(`/contracts/${contractId}/disputes`, data)
