import api from './axiosInstance.js'

export const trackEvent = async (eventData) => {
    const response = await api.post('/analytics/events', eventData)
    return response.data
}

export const getAnalytics = async (params) => {
    const response = await api.get('/analytics', { params })
    return response.data
}

export const getUserAnalytics = async (userId) => {
    const response = await api.get(`/analytics/users/${userId}`)
    return response.data
}

export const getJobAnalytics = async (jobId) => {
    const response = await api.get(`/analytics/jobs/${jobId}`)
    return response.data
}

export const getRevenueAnalytics = async (params) => {
    const response = await api.get('/analytics/revenue', { params })
    return response.data
}

export const getEngagementMetrics = async (params) => {
    const response = await api.get('/analytics/engagement', { params })
    return response.data
}

export const getConversionMetrics = async (params) => {
    const response = await api.get('/analytics/conversion', { params })
    return response.data
}
