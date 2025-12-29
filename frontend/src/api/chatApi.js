import api from './axiosInstance.js'

export const sendMessage = async (messageData) => {
    const response = await api.post('/chat/messages', messageData)
    return response.data
}

export const getMessages = async (conversationId) => {
    const response = await api.get(`/chat/messages/${conversationId}`)
    return response.data
}

export const getConversations = async () => {
    const response = await api.get('/chat/conversations')
    return response.data
}

export const getUsers = async () => {
    const response = await api.get('/chat/users')
    return response.data
}

export const createConversation = async (participantId) => {
    const response = await api.post('/chat/conversations', { participantId })
    return response.data
}

export const markAsRead = async (conversationId) => {
    const response = await api.patch(`/chat/conversations/${conversationId}/read`)
    return response.data
}

export const deleteConversation = async (conversationId) => {
    const response = await api.delete(`/chat/conversations/${conversationId}`)
    return response.data
}

export const uploadChatFile = async (formData) => {
    const response = await api.post('/chat/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}
