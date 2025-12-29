import api from './axiosInstance.js'

export const searchAll = async (query, filters = {}) => {
    const response = await api.get('/search', {
        params: { query, ...filters }
    })
    return response.data
}

export const searchJobs = async (query, filters = {}) => {
    const response = await api.get('/search/jobs', {
        params: { query, ...filters }
    })
    return response.data
}

export const searchFreelancers = async (params = {}) => {
    const response = await api.get('/search/freelancers', {
        params
    })
    return response.data
}

export const searchClients = async (query, filters = {}) => {
    const response = await api.get('/search/clients', {
        params: { query, ...filters }
    })
    return response.data
}

export const getSearchSuggestions = async (query) => {
    const response = await api.get('/search/suggestions', {
        params: { query }
    })
    return response.data
}

export const getPopularSearches = async () => {
    const response = await api.get('/search/popular')
    return response.data
}

export const saveSearch = async (searchData) => {
    const response = await api.post('/search/save', searchData)
    return response.data
}

export const getSavedSearches = async () => {
    const response = await api.get('/search/saved')
    return response.data
}

export const deleteSavedSearch = async (searchId) => {
    const response = await api.delete(`/search/saved/${searchId}`)
    return response.data
}
