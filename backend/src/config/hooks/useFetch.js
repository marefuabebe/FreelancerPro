import { useEffect, useState } from 'react'
import api from '../api/axiosInstance.js'

export function useFetch(url, { params, skip } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (skip) return
    const controller = new AbortController()
    setLoading(true)
    api.get(url, { params, signal: controller.signal })
      .then((res) => setData(res.data?.data ?? res.data))
      .catch((err) => { if (err.name !== 'CanceledError') setError(err.message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [url, JSON.stringify(params), skip])

  return { data, loading, error }
}
