'use client'

import { useEffect, useState, useCallback } from 'react'

interface SSEUpdate {
  visitors: number
  recentEvents: Array<{
    type: string
    path: string
    device: string
    browser: string
    timestamp: string
  }>
  notifications: Array<{
    type: string
    from: string
    content: string
    timestamp: string
  }>
  timestamp: number
}

export function useSSE() {
  const [data, setData] = useState<SSEUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const connect = useCallback(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.addEventListener('connected', () => {
      setIsConnected(true)
      setError(null)
    })

    eventSource.addEventListener('update', (event) => {
      try {
        const update = JSON.parse(event.data) as SSEUpdate
        setData(update)
      } catch (e) {
        console.error('SSE parse error:', e)
      }
    })

    eventSource.onerror = () => {
      setIsConnected(false)
      setError(new Error('Connection lost'))
      eventSource.close()
      
      // Reconnect after 5 seconds
      setTimeout(connect, 5000)
    }

    return eventSource
  }, [])

  useEffect(() => {
    const eventSource = connect()

    return () => {
      eventSource.close()
    }
  }, [connect])

  return {
    data,
    isConnected,
    error,
    visitors: data?.visitors || 0,
    recentEvents: data?.recentEvents || [],
    notifications: data?.notifications || [],
  }
}
