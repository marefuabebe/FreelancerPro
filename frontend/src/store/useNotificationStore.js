import { create } from 'zustand'
import { io } from 'socket.io-client'
import * as api from '../api/notificationApi.js'
import { getToken } from '../utils/storage.js'

let socket = null

export const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  socketConnected: false,

  // Initialize socket connection
  initSocket() {
    const token = getToken()
    if (!token || socket) return

    console.log('🔌 Initializing notification socket...')
    const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    console.log('📡 Connecting to:', url)

    socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('✅ Notification socket connected, ID:', socket.id)
      console.log('🔐 Authenticated with token')
      set({ socketConnected: true })
    })

    socket.on('disconnect', () => {
      console.log('❌ Notification socket disconnected')
      set({ socketConnected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('🔴 Notification socket connection error:', error)
    })

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      console.log('🔔 New notification received:', notification)
      console.log('📋 Title:', notification.title)
      console.log('📋 Message:', notification.message)

      // Add notification to the beginning of the list
      const currentItems = get().items
      set({
        items: [notification, ...currentItems],
        unreadCount: get().unreadCount + 1
      })

      console.log('✅ Notification added to store, new count:', get().unreadCount)

      // Optional: Play notification sound or show browser notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png',
          })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
                icon: '/logo.png',
              })
            }
          })
        }
      }
    })

    console.log('✅ Notification socket initialized and listening for new_notification events')
  },

  // Disconnect socket
  disconnectSocket() {
    if (socket) {
      socket.disconnect()
      socket = null
      set({ socketConnected: false })
    }
  },

  async fetch() {
    set({ loading: true, error: null })
    try {
      const { data } = await api.getNotifications()
      // Backend returns { data: { notifications, pagination } }
      const items = data.data?.notifications || data.notifications || []
      set({ items, unreadCount: items.filter(n => !n.read).length, loading: false })

      // Initialize socket after fetching notifications
      get().initSocket()
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false })
    }
  },

  async markRead(ids) {
    await api.markAsRead(ids)
    set({ items: get().items.map(n => ids.includes(n.id || n._id) ? { ...n, read: true } : n), unreadCount: Math.max(0, get().unreadCount - ids.length) })
  },

  async remove(id) {
    await api.deleteNotification(id)
    const removedItem = get().items.find(n => (n.id || n._id) === id)
    set({
      items: get().items.filter(n => (n.id || n._id) !== id),
      unreadCount: removedItem && !removedItem.read ? Math.max(0, get().unreadCount - 1) : get().unreadCount
    })
  },
}))
