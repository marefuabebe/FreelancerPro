import api from './axiosInstance.js'

export const getNotifications = () => api.get('/notifications')
export const markAsRead = (ids) => api.post('/notifications/mark-as-read', { ids })
export const deleteNotification = (id) => api.delete(`/notifications/${id}`)
