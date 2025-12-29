import api from './axiosInstance.js'

export const getNotifications = async (params) => {
    const response = await api.get('/notifications', { params })
    return response.data
}

export const markAsRead = async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
}

export const markAllAsRead = async () => {
    const response = await api.patch('/notifications/read-all')
    return response.data
}

export const deleteNotification = async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
}

export const getUnreadCount = async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
}

export const updateNotificationSettings = async (settings) => {
    const response = await api.put('/notifications/settings', settings)
    return response.data
}

export const getNotificationSettings = async () => {
    const response = await api.get('/notifications/settings')
    return response.data
}
