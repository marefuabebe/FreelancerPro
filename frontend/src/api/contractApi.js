import api from './axiosInstance.js'

export const createContract = async (contractData) => {
    const response = await api.post('/contracts', contractData)
    return response.data
}

export const getContracts = async (params) => {
    const response = await api.get('/contracts', { params })
    return response.data
}

export const getContractById = async (contractId) => {
    const response = await api.get(`/contracts/${contractId}`)
    return response.data
}

export const updateContract = async (contractId, contractData) => {
    const response = await api.put(`/contracts/${contractId}`, contractData)
    return response.data
}

export const acceptContract = async (contractId) => {
    const response = await api.patch(`/contracts/${contractId}/accept`)
    return response.data
}

export const rejectContract = async (contractId) => {
    const response = await api.patch(`/contracts/${contractId}/reject`)
    return response.data
}

export const completeContract = async (contractId) => {
    const response = await api.patch(`/contracts/${contractId}/complete`)
    return response.data
}

export const cancelContract = async (contractId, reason) => {
    const response = await api.patch(`/contracts/${contractId}/cancel`, { reason })
    return response.data
}

export const getMyContracts = async () => {
    const response = await api.get('/contracts/my-contracts')
    return response.data
}

export const createMilestone = async (contractId, milestoneData) => {
    const response = await api.post(`/contracts/${contractId}/milestones`, milestoneData)
    return response.data
}

export const approveMilestone = async (contractId, milestoneId) => {
    const response = await api.patch(`/contracts/${contractId}/milestones/${milestoneId}/approve`)
    return response.data
}
