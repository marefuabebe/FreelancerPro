import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../utils/storage.js'

export function useSocket() {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    console.log('🔌 Connecting to socket:', url);

    const socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
    });

    socketRef.current = socket
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef
}


