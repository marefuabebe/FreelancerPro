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
      set({ messages: [...get().messages, message] })
    })

    socket.on('message_sent', (message) => {
      set({ messages: [...get().messages, message] })
    })

    socket.on('user_typing', ({ userId, typing }) => {
      set((state) => ({ typingUsers: { ...state.typingUsers, [userId]: typing } }))
    })
  },
}))
