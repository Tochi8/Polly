'use client'

import { useState, useEffect, useCallback } from 'react'

interface Voter {
  id: string
  username: string
  provider: string
  registered_at: string
}

export function useVoters(pollId: string | undefined) {
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVoters = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/registrations?poll_id=${id}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to fetch voters')
        return
      }
      setVoters(data.voters || [])
    } catch {
      setError('Something went wrong fetching voters')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (pollId) fetchVoters(pollId)
  }, [pollId, fetchVoters])

  return { voters, loading, error }
}