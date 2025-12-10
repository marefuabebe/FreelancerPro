import { create } from 'zustand'
import * as api from '../api/notificationApi.js'

export const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,

  async fetch() {
    set({ loading: true, error: null })
    try {
      const { data } = await api.getNotifications()
      const items = (data.data || data).items || (data.data || data)
      set({ items, unreadCount: items.filter(n => !n.read).length, loading: false })
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
    set({ items: get().items.filter(n => (n.id || n._id) !== id) })
  },
}))
