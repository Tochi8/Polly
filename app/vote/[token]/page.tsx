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
  allowed_providers: string[]
  community_id: string | null
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

type PageState =
  | 'loading'
  | 'upcoming'
  | 'registering'
  | 'registered'
  | 'registration_closed'
  | 'missed_registration'
  | 'not_allowed'
  | 'not_a_member'
  | 'vote'
  | 'processing'
  | 'recorded'
  | 'results'
  | 'already_voted'
  | 'error'

const RESULT_COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed']

function getPollPhase(poll: Poll): string {
  const now = new Date()
  if (!poll.registration_opens_at) return 'draft'
  if (now < new Date(poll.registration_opens_at)) return 'upcoming'
  if (now < new Date(poll.registration_closes_at)) return 'registration_open'
  if (now < new Date(poll.voting_opens_at)) return 'registration_closed'
  if (now < new Date(poll.voting_closes_at)) return 'voting_open'
  return 'closed'
}

function PollyLogo() {
  return (
    <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="2" width="5" height="28" rx="1" fill="#2d5a1b"/>
      <rect x="5" y="2" width="9" height="6" rx="1" fill="#2d5a1b"/>
      <rect x="14" y="2" width="6" height="6" rx="1" fill="#4a8a2d"/>
      <rect x="14" y="8" width="6" height="6" rx="1" fill="#2d5a1b"/>
      <rect x="5" y="14" width="9" height="6" rx="1" fill="#2d5a1b"/>
      <circle cx="2.5" cy="5" r="1" fill="#4a8a2d"/>
      <circle cx="2.5" cy="27" r="1" fill="#4a8a2d"/>
      <circle cx="17" cy="5" r="1" fill="#4a8a2d"/>
      <circle cx="10" cy="17" r="1" fill="#4a8a2d"/>
      <text x="26" y="23" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#2d5a1b" letterSpacing="-0.5">Polly</text>
    </svg>
  )
}

function PageHeader({ right }: { right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100">
      <PollyLogo />
      <div>{right}</div>
    </div>
  )
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Vote Recorded</h2>
      <p className="text-sm text-gray-400 text-center">Your vote has been securely submitted</p>
    </div>
  )
}

function RegisteredScreen({ poll, user }: { poll: Poll; user: User }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <PageHeader />
      <div className="px-4 md:px-8 py-10 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You're registered!</h2>
        <p className="text-base text-gray-500 mb-8">
          @{user.username}, you have successfully registered to vote in this poll.
        </p>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 text-left mb-8">
          <p className="text-xs text-gray-400 mb-1">POLL</p>
          <p className="text-lg font-semibold text-gray-800 mb-6">{poll.title}</p>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <p className="text-sm text-gray-500">Registration closes</p>
              </div>
              <p className="text-sm font-medium text-gray-700">{formatDateTime(poll.registration_closes_at)}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <p className="text-sm text-gray-500">Voting opens</p>
              </div>
              <p className="text-sm font-medium text-gray-700">{formatDateTime(poll.voting_opens_at)}</p>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <p className="text-sm text-gray-500">Voting closes</p>
              </div>
              <p className="text-sm font-medium text-gray-700">{formatDateTime(poll.voting_closes_at)}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
          Come back when voting opens to cast your vote. Bookmark this page for easy access.
        </p>
      </div>
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
  receipt?: { candidateName: string; txHash: string } | null
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <PageHeader right={
        <p className="text-xs md:text-sm text-orange-400 font-medium">
          {timeLeft(poll.voting_closes_at)}
        </p>
      } />
      <div className="px-4 md:px-8 py-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Poll Results</h2>
        <p className="text-gray-600 mb-8">{poll.title}</p>
        <div className="mb-8">
          <p className="text-5xl font-bold text-gray-800">{totalVotes}</p>
          <p className="text-sm text-gray-400">Total Votes Cast</p>
        </div>
        <div className="space-y-6">
          {results.map((result, i) => (
            <div key={result.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-base text-gray-700">{result.name}</p>
                <p className="text-base font-semibold text-gray-800">
                  {result.percentage}% <span className="text-sm text-gray-500">({result.votes})</span>
                </p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.percentage}%`, backgroundColor: RESULT_COLORS[i % RESULT_COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
        {receipt && (
          <div className="mt-10 border border-green-200 rounded-3xl p-6 bg-green-50">
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <p className="font-semibold text-green-700">Your Vote Receipt</p>
            </div>
            <p className="text-green-700 mb-1">You voted for</p>
            <p className="font-bold text-lg text-green-800 mb-4">{receipt.candidateName}</p>
            <p className="text-green-700 mb-1 text-sm">Transaction Hash</p>
            <p className="font-mono text-xs text-green-700 break-all bg-white p-3 rounded-2xl">{receipt.txHash}</p>
            <p className="text-xs text-green-600 mt-3">You can use this hash to verify your vote on Polygon Amoy explorer.</p>
          </div>
        )}
      </div>
    </div>
  )
}

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
    loadPoll(token as string, parsedUser)
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

      // Provider check
      const allowedProviders: string[] = fetchedPoll.allowed_providers ?? ['x', 'discord', 'telegram']
      if (!allowedProviders.includes(currentUser.provider)) {
        setPageState('not_allowed')
        return
      }

      // Community membership check
      if (fetchedPoll.community_id) {
        const memberRes = await fetch(
          `/api/communities/check-member?community_id=${fetchedPoll.community_id}&user_id=${currentUser.id}`
        )
        const memberData = await memberRes.json()
        if (!memberData.isMember) {
          setPageState('not_a_member')
          return
        }
      }

      const phase = getPollPhase(fetchedPoll)

      if (phase === 'upcoming') {
        setPageState('upcoming')
        return
      }

      if (phase === 'registration_open') {
        setPageState('registering')
        const regRes = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser.id, poll_id: fetchedPoll.id }),
        })
        const regData = await regRes.json()
        if (!regRes.ok && !regData.error?.includes('already registered')) {
          setError(regData.error || 'Registration failed')
          setPageState('error')
          return
        }
        setPageState('registered')
        return
      }

      if (phase === 'registration_closed') {
        const regCheckRes = await fetch(`/api/registrations/check?user_id=${currentUser.id}&poll_id=${fetchedPoll.id}`)
        const regCheckData = await regCheckRes.json()
        if (!regCheckData.isRegistered) {
          setPageState('missed_registration')
        } else {
          setPageState('registration_closed')
        }
        return
      }

      if (phase === 'voting_open') {
        const voteCheckRes = await fetch(`/api/votes/check?user_id=${currentUser.id}&poll_id=${fetchedPoll.id}`)
        const voteCheckData = await voteCheckRes.json()
        if (voteCheckData.hasVoted) {
          await loadResults(fetchedPoll.id)
          setPageState('already_voted')
          return
        }
        const regCheckRes = await fetch(`/api/registrations/check?user_id=${currentUser.id}&poll_id=${fetchedPoll.id}`)
        const regCheckData = await regCheckRes.json()
        if (!regCheckData.isRegistered) {
          setPageState('missed_registration')
          return
        }
        setPageState('vote')
        return
      }

      await loadResults(fetchedPoll.id)
      setPageState('results')

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
      // silently fail
    }
  }

  async function handleSubmitVote() {
    if (!selectedId || !poll || !user) return
    setPageState('processing')
    try {
      const res = await fetch('/api/cast-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, poll_id: poll.id, candidate_id: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit vote')
        setPageState('vote')
        return
      }
      const votedCandidate = candidates.find(c => c.id === selectedId)
      setReceipt({
        candidateName: votedCandidate?.name ?? 'Unknown',
        txHash: data.vote?.tx_hash ?? '',
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

  if (pageState === 'loading' || pageState === 'registering') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
      </div>
    )
  }

  if (pageState === 'processing') return <ProcessingScreen />
  if (pageState === 'recorded') return <VoteRecordedScreen onViewResults={handleViewResults} />
  if (pageState === 'registered' && poll && user) return <RegisteredScreen poll={poll} user={user} />
  if (pageState === 'results' || pageState === 'already_voted') {
    return <ResultsScreen poll={poll!} results={results} totalVotes={totalVotes} receipt={receipt} />
  }

  if (pageState === 'upcoming') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Poll not open yet</h2>
          <p className="text-sm text-gray-400 mb-4">Registration opens on</p>
          {poll && <p className="text-sm font-semibold text-gray-700">{formatDateTime(poll.registration_opens_at)}</p>}
        </div>
      </div>
    )
  }

  if (pageState === 'registration_closed') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Registration closed</h2>
          <p className="text-sm text-gray-400 mb-4">You're registered. Voting opens on</p>
          {poll && <p className="text-sm font-semibold text-gray-700">{formatDateTime(poll.voting_opens_at)}</p>}
        </div>
      </div>
    )
  }

  if (pageState === 'missed_registration') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Registration closed</h2>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            The registration window for this poll has closed. You needed to register before{' '}
            {poll && <span className="font-medium text-gray-600">{formatDateTime(poll.registration_closes_at)}</span>}
            {' '}to be eligible to vote.
          </p>
        </div>
      </div>
    )
  }

  if (pageState === 'not_allowed') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Access restricted</h2>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            This poll is only available to{' '}
            <span className="font-medium text-gray-600">{poll?.allowed_providers?.join(', ')}</span>{' '}
            users. You signed in with{' '}
            <span className="font-medium text-gray-600">{user?.provider}</span>.
          </p>
        </div>
      </div>
    )
  }

  if (pageState === 'not_a_member') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Not a community member</h2>
          <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
            This poll is restricted to members of a specific community. Contact the poll creator to get an invite link.
          </p>
        </div>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <div className="flex flex-col items-center justify-center px-8 text-center py-24">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <PageHeader right={
        <p className="text-xs md:text-sm text-orange-400 font-medium">
          {poll && timeLeft(poll.voting_closes_at)}
        </p>
      } />

      <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
        <div className="w-full aspect-[16/7] bg-gray-200 rounded-3xl mb-8 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{poll?.title}</h1>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <p className="text-sm text-gray-500">Single choice • One vote per person</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-700 mb-4">Choose your option</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {candidates.map((candidate) => {
            const isSelected = selectedId === candidate.id
            return (
              <button
                key={candidate.id}
                onClick={() => setSelectedId(candidate.id)}
                className={`w-full text-left rounded-3xl border-2 p-5 transition-all ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium text-gray-800 mb-1">{candidate.name}</p>
                    {candidate.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{candidate.description}</p>
                    )}
                  </div>
                  <div className={`ml-4 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSubmitVote}
          disabled={!selectedId}
          className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-lg disabled:opacity-40 hover:bg-[#254d17] transition-colors"
        >
          Submit My Vote
        </button>
      </div>
    </div>
  )
}