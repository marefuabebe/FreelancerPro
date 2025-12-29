import api from './axiosInstance.js'

export const getUserProfile = async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
}

export const updateUserProfile = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData)
    return response.data
}

export const uploadKYC = async (formData) => {
    const response = await api.post('/users/kyc', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const getPortfolio = async (userId) => {
    const response = await api.get(`/users/${userId}/portfolio`)
    return response.data
}

export const updatePortfolio = async (userId, portfolioData) => {
    const response = await api.put(`/users/${userId}/portfolio`, portfolioData)
    return response.data
}

export const uploadFile = async (formData) => {
    const response = await api.post('/users/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const updateProfilePicture = async (formData) => {
    const response = await api.post('/users/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

export const uploadAvatar = updateProfilePicture;

export const getFreelancers = async (params) => {
    const response = await api.get('/users/freelancers', { params })
    return response.data
}

export const getFreelancersByCategory = async (category) => {
    const response = await api.get(`/users/freelancers/category/${category}`)
    return response.data
}
