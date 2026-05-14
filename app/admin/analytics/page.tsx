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

interface Poll {
  id: string
  title: string
  status: string
  voting_closes_at: string
}

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed']

function getTimeLeft(closesAt: string): { d: number; h: number; m: number; s: number } {
  const diff = Math.max(0, new Date(closesAt).getTime() - Date.now())
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function DonutChart({ results }: { results: Result[] }) {
  const size = 240
  const center = size / 2
  const ringGap = 12
  const ringWidth = 14

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {results.map((result, i) => {
        const radius = center - ringWidth / 2 - i * (ringWidth + ringGap)
        if (radius <= 0) return null
        const circumference = 2 * Math.PI * radius
        const filledLength = (result.percentage / 100) * circumference
        const gapLength = circumference - filledLength

        return (
          <g key={result.id}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={ringWidth} />
            <circle
              cx={center} cy={center} r={radius} fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={ringWidth}
              strokeDasharray={`${filledLength} ${gapLength}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </g>
        )
      })}
    </svg>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useUser('admin')
  const { polls, loading, error: pollsError } = usePolls(user?.id)

  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    if (polls.length > 0 && !selectedPoll) {
      setSelectedPoll(polls[0])
    }
  }, [polls])

  const fetchResults = useCallback(async (pollId: string) => {
    try {
      const res = await fetch(`/api/polls/${pollId}/results`)
      const data = await res.json()
      if (res.ok) {
        setResults(data.results)
        setTotalVotes(data.totalVotes)
      }
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (selectedPoll?.id) fetchResults(selectedPoll.id)
  }, [selectedPoll, fetchResults])

  useEffect(() => {
    if (!selectedPoll) return
    setTimeLeft(getTimeLeft(selectedPoll.voting_closes_at))
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(selectedPoll.voting_closes_at))
    }, 1000)
    return () => clearInterval(interval)
  }, [selectedPoll])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button onClick={() => router.back()} className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
          ← Back
        </button>
        
        {selectedPoll && (
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Ends in:{' '}
            <span className="text-gray-800 font-semibold">
              {pad(timeLeft.d)}d : {pad(timeLeft.h)}h : {pad(timeLeft.m)}m : {pad(timeLeft.s)}s
            </span>
          </p>
        )}
        
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
        {pollsError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {pollsError}
          </div>
        )}

        {polls.length > 1 && (
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1">Select Poll</label>
            <select
              value={selectedPoll?.id ?? ''}
              onChange={(e) => {
                const found = polls.find((p) => p.id === e.target.value)
                if (found) setSelectedPoll(found)
              }}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm bg-white outline-none focus:border-gray-400"
            >
              {polls.map((poll) => (
                <option key={poll.id} value={poll.id}>{poll.title}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading analytics...</div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No polls yet.{' '}
            <button onClick={() => router.push('/admin/polls/new')} className="text-[#2d5a1b] font-medium">
              Create your first poll
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">Poll Analysis</h2>

            {results.length > 0 ? (
              <div className="flex justify-center mb-10">
                <DonutChart results={results} />
              </div>
            ) : (
              <div className="flex justify-center mb-10">
                <div className="w-56 h-56 rounded-full border-8 border-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-400 text-center">No votes yet</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                <p className="text-xs font-semibold text-gray-500 flex-1">Option</p>
                <p className="text-xs font-semibold text-gray-500 w-20 text-right">Votes</p>
                <p className="text-xs font-semibold text-gray-500 w-16 text-right">Percentage</p>
              </div>

              {results.length > 0 ? (
                results.map((result, i) => (
                  <div key={result.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                      />
                      <p className="text-base text-gray-700 truncate">{result.name}</p>
                    </div>
                    <p className="text-base font-semibold text-gray-800 w-20 text-right">{result.votes}</p>
                    <p className="text-base font-semibold text-gray-800 w-16 text-right">{result.percentage}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No votes recorded yet</p>
              )}

              {results.length > 0 && (
                <div className="flex items-center justify-between pt-5 mt-2 border-t border-gray-200">
                  <p className="text-base font-semibold text-gray-700 flex-1">Total Votes</p>
                  <p className="text-base font-semibold text-gray-800 w-20 text-right">{totalVotes}</p>
                  <p className="text-base font-semibold text-gray-800 w-16 text-right">100%</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  )
}