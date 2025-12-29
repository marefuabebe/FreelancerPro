import api from './axiosInstance.js'

export const createProposal = async (proposalData) => {
    const response = await api.post('/proposals', proposalData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const getProposals = async (params) => {
    const response = await api.get('/proposals', { params })
    return response.data
}

export const getProposalById = async (proposalId) => {
    const response = await api.get(`/proposals/${proposalId}`)
    return response.data
}

export const updateProposal = async (proposalId, proposalData) => {
    const response = await api.put(`/proposals/${proposalId}`, proposalData)
    return response.data
}

export const deleteProposal = async (proposalId) => {
    const response = await api.delete(`/proposals/${proposalId}`)
    return response.data
}

export const getMyProposals = async () => {
    const response = await api.get('/proposals/my-proposals')
    return response.data
}

export const getProposalsByJob = async (jobId) => {
    const response = await api.get(`/proposals/job/${jobId}`)
    return response.data
}

export const acceptProposal = async (proposalId) => {
    const response = await api.patch(`/proposals/${proposalId}/accept`)
    return response.data
}

export const rejectProposal = async (proposalId) => {
    const response = await api.patch(`/proposals/${proposalId}/reject`)
    return response.data
}

export const withdrawProposal = async (proposalId) => {
    const response = await api.patch(`/proposals/${proposalId}/withdraw`)
    return response.data
}
