import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore.js'
import { getToken, clearToken } from '../utils/storage.js'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            // Prevent infinite loop: if logout itself returns 401, don't trigger logout again
            if (error.config?.url?.includes('/auth/logout')) {
                return Promise.reject(error)
            }

            // Clear auth state and redirect to login
            clearToken()
            useAuthStore.getState().logout()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export { api }
export default api
