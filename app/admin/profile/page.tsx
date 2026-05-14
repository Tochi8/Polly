'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { usePolls } from '@/hooks/usePolls'

interface Result {
  id: string
  name: string
  votes: number
  percentage: number
}

interface PollWithResults {
  id: string
  title: string
  status: string
  voting_closes_at: string
  registeredCount: number
  votesCount: number
  results: Result[]
  totalVotes: number
}

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed']

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatPollDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useUser('admin')
  const { polls: rawPolls, error: pollsError } = usePolls(user?.id)

  const [polls, setPolls] = useState<PollWithResults[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPollsWithResults = useCallback(async () => {
    try {
      const pollsWithResults = await Promise.all(
        rawPolls.map(async (poll) => {
          try {
            const resultsRes = await fetch(`/api/polls/${poll.id}/results`)
            const resultsData = await resultsRes.json()
            return {
              ...poll,
              results: resultsData.results || [],
              totalVotes: resultsData.totalVotes || 0,
            }
          } catch {
            return { ...poll, results: [], totalVotes: 0 }
          }
        })
      )
      setPolls(pollsWithResults)
    } catch {
      setError('Something went wrong fetching your profile')
    } finally {
      setLoading(false)
    }
  }, [rawPolls])

  useEffect(() => {
    if (rawPolls.length > 0) fetchPollsWithResults()
    else setLoading(false)
  }, [rawPolls, fetchPollsWithResults])

  const totalVotesCast = polls.reduce((acc, p) => acc + p.votesCount, 0)

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button onClick={() => router.back()} className="text-gray-500 text-sm hover:text-gray-800">
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Profile</span>
        <div className="w-10" />
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {(error || pollsError) && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error || pollsError}
          </div>
        )}

        <div className="mb-6">
          <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">
              {user.username?.[0]?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">{user.username}</h2>
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-gray-400">📅</span>
            <p className="text-xs text-gray-400">Joined {formatDate(user.created_at)}</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm font-bold text-gray-800">{polls.length}</span>
              <span className="text-xs text-gray-400 ml-1">Poll Created</span>
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800">{totalVotesCast}</span>
              <span className="text-xs text-gray-400 ml-1">Vote</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mb-6" />

        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
        ) : polls.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No polls created yet.{' '}
            <button onClick={() => router.push('/admin/polls/new')} className="text-green-600 font-medium">
              Create your first poll
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-800 flex-1 pr-2">{poll.title}</p>
                  <p className="text-xs text-gray-400 flex-shrink-0">{formatPollDate(poll.voting_closes_at)}</p>
                </div>

                {poll.results.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {poll.results.map((result, i) => (
                      <div key={result.id}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-600">{result.name}</p>
                          <p className="text-xs font-semibold text-gray-800">{result.percentage}%</p>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${result.percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No votes yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  )
}