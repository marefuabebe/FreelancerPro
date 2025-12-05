import api from './axiosInstance.js'

export const getProposals = (params) => api.get('/proposals', { params })
export const getProposalById = (id) => api.get(`/proposals/${id}`)
export const createProposal = (data) => api.post('/proposals', data)
export const updateProposal = (id, data) => api.put(`/proposals/${id}`, data)
