'use client'

import { useState, useEffect, useCallback } from 'react'
import { Poll } from '@/types/index'

export function usePolls(userId: string | undefined) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPolls = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/polls?created_by=${id}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to fetch polls')
        return
      }
      setPolls(data.polls || [])
    } catch {
      setError('Something went wrong fetching polls')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) fetchPolls(userId)
  }, [userId, fetchPolls])

  return { polls, loading, error, refetch: () => userId && fetchPolls(userId) }
}