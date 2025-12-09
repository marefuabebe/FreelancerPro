import api from './axiosInstance.js'

export const getConversations = () => api.get('/messages/conversations')
export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`)
export const sendMessage = (data) => api.post('/messages', data)
