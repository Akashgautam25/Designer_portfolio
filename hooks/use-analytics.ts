'use client'

import useSWR from 'swr'

interface AnalyticsStats {
  live: number
  today: {
    pageViews: number
    uniqueVisitors: number
    clicks: number
    avgSessionDuration: number
  }
  devices: Record<string, number>
  browsers: Record<string, number>
  topPages: Array<{ path: string; views: number }>
  hourlyTraffic: Array<{ hour: number; views: number }>
  recentEvents: Array<{
    type: string
    path: string
    device: string
    browser: string
    timestamp: string
  }>
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<AnalyticsStats>(
    '/api/analytics/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
    liveVisitors: data?.live || 0,
    todayStats: data?.today || {
      pageViews: 0,
      uniqueVisitors: 0,
      clicks: 0,
      avgSessionDuration: 0,
    },
    devices: data?.devices || {},
    browsers: data?.browsers || {},
    topPages: data?.topPages || [],
    hourlyTraffic: data?.hourlyTraffic || [],
    recentEvents: data?.recentEvents || [],
  }
}
