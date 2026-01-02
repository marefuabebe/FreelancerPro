import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { getToken } from '../utils/storage.js'

export function useSocket() {
  const socketRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    const socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      withCredentials: true,
    })

    socketRef.current = socket
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef
}



