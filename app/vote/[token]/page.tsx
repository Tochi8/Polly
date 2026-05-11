'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Candidate {
  id: string
  name: string
  description: string
}

interface Poll {
  id: string
  title: string
  status: string
  registration_opens_at: string
  registration_closes_at: string
  voting_opens_at: string
  voting_closes_at: string
  token: string
}

interface User {
  id: string
  username: string
  provider: string
  role: string
}

interface Result {
  id: string
  name: string
  votes: number
  percentage: number
}

function getPollPhase(poll: Poll): string {
  const now = new Date()
  if (!poll.registration_opens_at) return 'draft'
  if (now < new Date(poll.registration_opens_at)) return 'upcoming'
  if (now < new Date(poll.registration_closes_at)) return 'registration_open'
  if (now < new Date(poll.voting_opens_at)) return 'registration_closed'
  if (now < new Date(poll.voting_closes_at)) return 'voting_open'
  return 'closed'
}

const RESULT_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed']

function timeLeft(closesAt: string): string {
  const diff = new Date(closesAt).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}d left`
  if (h > 0) return `Ends in ${h}hrs`
  return `Ends in ${m}mins`
}


function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
      <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin mb-8" />
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Processing Your Vote</h2>
      <p className="text-sm text-gray-400 text-center">Securing your choice on blockchain</p>
    </div>
  )
}

function VoteRecordedScreen({ onViewResults }: { onViewResults: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onViewResults, 2500)
    return () => clearTimeout(timer)
  }, [onViewResults])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
      <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-8">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Vote Recorded</h2>
      <p className="text-sm text-gray-400 text-center">
        Your vote has been securely submitted
      </p>
    </div>
  )
}

function ResultsScreen({
  poll,
  results,
  totalVotes,
  receipt,
}: {
  poll: Poll
  results: Result[]
  totalVotes: number
  receipt?:  { candidateName: string; txHash: string } | null
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <div className="w-8 h-3 bg-gray-200 rounded" />
        <p className="text-xs text-orange-400 font-medium">
          {timeLeft(poll.voting_closes_at)}
        </p>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Poll Result</h2>
        <p className="text-sm text-gray-600 mb-6">{poll.title}</p>

        {/* Total votes */}
        <div className="mb-6">
          <p className="text-3xl font-bold text-gray-800">{totalVotes}</p>
          <p className="text-xs text-gray-400">Total Vote Casted</p>
        </div>

        {/* Options */}
        <p className="text-sm font-semibold text-gray-700 mb-3">Option</p>
        <div className="flex flex-col gap-4">
          {results.map((result, i) => (
            <div key={result.id}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700">{result.name}</p>
                <p className="text-sm font-semibold text-gray-800">
                  {result.percentage}% ({result.votes})
                </p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${result.percentage}%`,
                    backgroundColor: RESULT_COLORS[i % RESULT_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {receipt && (
        <div className="mt-6 border border-green-200 rounded-2xl p-4 bg-green-50">
        <div className="flex items-center gap-2 mb-3">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <p className="text-sm font-semibold text-green-700">Your vote receipt</p>
      </div>
      <div className="mb-3">
      <p className="text-xs text-green-600 mb-1">You voted for</p>
      <p className="text-sm font-bold text-green-800">{receipt.candidateName}</p>
    </div>
    <div>
      <p className="text-xs text-green-600 mb-1">Blockchain confirmation hash</p>
      <p className="text-[11px] font-mono text-green-700 break-all leading-relaxed">
        {receipt.txHash}
      </p>
      <p className="text-xs text-green-500 mt-2">
        Use this hash to verify your vote on Polygon Amoy
      </p>
    </div>
  </div>
  )}
      </div>
    </div>
    )
  }


type PageState =
  | 'loading'
  | 'vote'
  | 'processing'
  | 'recorded'
  | 'results'
  | 'error'
  | 'closed'
  | 'already_voted'


export default function VotePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [poll, setPoll] = useState<Poll | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [receipt, setReceipt] = useState<{ candidateName: string; txHash: string } | null>(null)


  useEffect(() => {
    const stored = localStorage.getItem('polly_user')
    if (!stored) {
      localStorage.setItem('polly_redirect', `/vote/${token}`)
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(stored)
    setUser(parsedUser)
    loadPoll(token, parsedUser)
  }, [token, router])


  async function loadPoll(pollToken: string, currentUser: User) {
    try {
      const res = await fetch(`/api/polls/token/${pollToken}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Poll not found')
        setPageState('error')
        return
      }

      const fetchedPoll: Poll = data.poll
      const fetchedCandidates: Candidate[] = data.candidates
      setPoll(fetchedPoll)
      setCandidates(fetchedCandidates)


      const phase = getPollPhase(fetchedPoll)

      if (phase === 'closed') {
        await loadResults(fetchedPoll.id)
        setPageState('results')
        return
      }

    
      if (phase === 'upcoming' || phase === 'registration_open' || phase === 'registration_closed') {
    setPageState('closed')
    return
}

      const regRes = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        poll_id: fetchedPoll.id,
      }),
      })
      const regData = await regRes.json()
      console.log('Registration result:', regData)

      const voteCheckRes = await fetch(
        `/api/votes/check?user_id=${currentUser.id}&poll_id=${fetchedPoll.id}`
      )
      const voteCheckData = await voteCheckRes.json()

      if (voteCheckData.hasVoted) {
        await loadResults(fetchedPoll.id)
        setPageState('already_voted')
        return
      }

      setPageState('vote')
    } catch (err) {
    console.error('loadPoll error:', err)
    setError('Something went wrong loading this poll')
    setPageState('error')
}
  }

  async function loadResults(pollId: string) {
    try {
      const res = await fetch(`/api/polls/${pollId}/results`)
      const data = await res.json()
      if (res.ok) {
        setResults(data.results)
        setTotalVotes(data.totalVotes)
      }
    } catch {
      // silently fail — results are optional
    }
  }

  async function handleSubmitVote() {
    if (!selectedId || !poll || !user) return
    setPageState('processing')

    try {
      const res = await fetch('/api/cast-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          poll_id: poll.id,
          candidate_id: selectedId,
        }),
      })

      const data = await res.json()
      console.log('Vote response:', data)

      if (!res.ok) {
        setError(data.error || 'Failed to submit vote')
        setPageState('vote')
        return
      }
      const votedCandidate = candidates.find(c => c.id === selectedId)
      setReceipt({
      candidateName: votedCandidate?.name ?? 'Unknown',
      txHash: data.vote?.tx_hash ?? ''
      })
      setPageState('recorded')
    } catch {
      setError('Something went wrong submitting your vote')
      setPageState('vote')
    }
  }

  async function handleViewResults() {
    if (poll) await loadResults(poll.id)
    setPageState('results')
  }


  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
      </div>
    )
  }

  if (pageState === 'processing') return <ProcessingScreen />

  if (pageState === 'recorded') {
    return <VoteRecordedScreen onViewResults={handleViewResults} />
  }

  if (pageState === 'results' || pageState === 'already_voted') {
    return (
      <ResultsScreen
        poll={poll!}
        results={results}
        totalVotes={totalVotes}
        receipt={pageState === 'results' ? receipt : null}
      />
    )
}

  if (pageState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    )
  }

  if (pageState === 'closed') {
    const phase = poll ? getPollPhase(poll) : 'upcoming'
    const message = 
        phase === 'upcoming' ? 'This poll hasn\'t opened for registration yet. Check back soon.' :
        phase === 'registration_open' ? 'Registration is open but voting hasn\'t started yet.' :
        phase === 'registration_closed' ? 'Registration is closed. Voting opens soon.' :
        'This poll is not currently active.'

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
            <p className="text-4xl mb-4">🔒</p>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Not open yet
            </h2>
            <p className="text-sm text-gray-400">{message}</p>
        </div>
    )
}

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <div className="w-8 h-3 bg-gray-200 rounded" />
        <p className="text-xs text-orange-400 font-medium">
          {poll && timeLeft(poll.voting_closes_at)}
        </p>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Poll image placeholder */}
        <div className="w-full aspect-[16/7] bg-gray-200 rounded-b-2xl mb-6 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>

        {/* Question */}
        <h2 className="text-base font-semibold text-gray-800 mb-1">{poll?.title}</h2>
        <div className="flex items-center gap-1 mb-4">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <p className="text-xs text-gray-400">No multiple answer</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Options */}
        <p className="text-sm font-semibold text-gray-700 mb-3">Option</p>
        <div className="flex flex-col gap-3 mb-8">
          {candidates.map((candidate) => {
            const isSelected = selectedId === candidate.id
            return (
              <button
                key={candidate.id}
                onClick={() => setSelectedId(candidate.id)}
                className={`w-full text-left rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-1">{candidate.name}</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-200 rounded-full w-0" />
                    </div>
                  </div>
                  <div
                    className={`ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmitVote}
          disabled={!selectedId}
          className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-[#254d17] transition-colors mb-8"
        >
          Submit Vote
        </button>
      </div>
    </div>
  )
}