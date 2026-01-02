import { create } from 'zustand'
import { sendMessage as sendMessageApi, getMessages } from '../api/chatApi.js'

export const useChatStore = create((set, get) => ({
  messages: [],
  typingUsers: {},

  async loadConversation(conversationId) {
    const { data } = await getMessages(conversationId)
    const items = data.data || data
    set({ messages: items })
  },

  async sendMessage({ recipientId, content, attachments, relatedTo }) {
    const { data } = await sendMessageApi({ recipientId, content, attachments, relatedTo })
    const msg = data.data || data
    set({ messages: [...get().messages, msg] })
  },

  registerSocketHandlers(socketRef) {
    const socket = socketRef.current
    if (!socket) return

    socket.on('new_message', (message) => {
      // Check if message already exists to prevent duplicates
      const currentMessages = get().messages
      const exists = currentMessages.some(m => (m._id || m.id) === (message._id || message.id))

      if (!exists) {
        console.log('📨 Received new_message:', message._id)
        set({ messages: [...currentMessages, message] })
      } else {
        console.log('⚠️ Duplicate new_message ignored:', message._id)
      }
    })

    socket.on('message_sent', (message) => {
      // Check if message already exists to prevent duplicates
      const currentMessages = get().messages
      const exists = currentMessages.some(m => (m._id || m.id) === (message._id || message.id))

      if (!exists) {
        console.log('✅ Received message_sent:', message._id)
        set({ messages: [...currentMessages, message] })
      } else {
        console.log('⚠️ Duplicate message_sent ignored:', message._id)
      }
    })

    socket.on('user_typing', ({ userId, typing }) => {
      set((state) => ({ typingUsers: { ...state.typingUsers, [userId]: typing } }))
    })
  },
}))
