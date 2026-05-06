'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Poll {
  id: string
  title: string
  status: string
  voting_closes_at: string
  created_by: string
  registeredCount: number
  votesCount: number
}

interface User {
  id: string
  username: string
  provider: string
  role: string
}

function isPollExpired(closesAt: string): boolean {
  return new Date(closesAt) < new Date()
}

function formatStatus(poll: Poll): 'completed' | 'live' | 'registration_open' | 'closed' {
  if (isPollExpired(poll.voting_closes_at) || poll.status === 'closed') return 'completed'
  if (poll.status === 'voting_open') return 'live'
  if (poll.status === 'registration_open') return 'registration_open'
  return 'closed'
}


function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 ${color}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function PollCard({
  poll,
  onClosePoll,
}: {
  poll: Poll
  onClosePoll: (poll: Poll) => void
}) {
  const status = formatStatus(poll)

  return (
    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-400 mb-0.5">Polygon</p>
          <p className="text-sm font-semibold text-gray-800 truncate">{poll.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">DAO Governance Hub</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-center flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-gray-800">{poll.registeredCount}</p>
            <p className="text-[10px] text-gray-400">Registered</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{poll.votesCount}</p>
            <p className="text-[10px] text-gray-400">Votes</p>
          </div>

          {/* Status button */}
          {status === 'completed' ? (
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full">
              Completed
            </span>
          ) : status === 'live' ? (
            <button
              onClick={() => onClosePoll(poll)}
              className="bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-teal-600 transition-colors"
            >
              Close Poll
            </button>
          ) : status === 'registration_open' ? (
            <button
              onClick={() => onClosePoll(poll)}
              className="bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors"
            >
              Go Live
            </button>
          ) : (
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              Closed
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({
  poll,
  onConfirm,
  onCancel,
  loading,
}: {
  poll: Poll
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const status = formatStatus(poll)
  const nextStatus = status === 'registration_open' ? 'Live' : 'Complete'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <p className="text-sm font-semibold text-gray-800">Confirm Phase Change</p>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          You are about to advance the poll to{' '}
          <span className="text-green-500 font-semibold">{nextStatus}</span>. This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-green-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

function HamburgerMenu({
  user,
  onClose,
  onLogout,
  router,
}: {
  user: User
  onClose: () => void
  onLogout: () => void
  router: ReturnType<typeof useRouter>
}) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute top-14 right-4 bg-white rounded-2xl shadow-xl p-4 w-56"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Community info */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
            {user.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user.provider}</p>
          </div>
        </div>

        {/* Menu items */}
        <button
          onClick={() => { router.push('/admin/polls/new'); onClose() }}
          className="flex items-center gap-3 w-full py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span>+</span> Create Poll
        </button>
        <button
          onClick={() => { router.push('/admin/analytics'); onClose() }}
          className="flex items-center gap-3 w-full py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span>📊</span> Analytics
        </button>
        <button
          onClick={() => { router.push('/admin/settings'); onClose() }}
          className="flex items-center gap-3 w-full py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span>⚙️</span> Settings
        </button>
        <div className="border-t border-gray-100 mt-2 pt-2">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full py-2 text-sm text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmPoll, setConfirmPoll] = useState<Poll | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('polly_user')
    if (!stored) {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'admin') {
      router.push('/')
      return
    }
    setUser(parsed)
  }, [router])

  // ── Fetch polls ──
  const fetchPolls = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/polls?created_by=${userId}`)
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
    if (user?.id) fetchPolls(user.id)
  }, [user, fetchPolls])

  const totalRegistered = polls.reduce((acc, p) => acc + p.registeredCount, 0)
  const totalVotes = polls.reduce((acc, p) => acc + p.votesCount, 0)

  async function handleAdvancePoll() {
    if (!confirmPoll) return
    setActionLoading(true)

    const status = formatStatus(confirmPoll)
    const nextStatus = status === 'registration_open' ? 'voting_open' : 'closed'

    try {
      const res = await fetch(`/api/polls/${confirmPoll.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update poll')
        return
      }

      setPolls((prev) =>
        prev.map((p) =>
          p.id === confirmPoll.id ? { ...p, status: nextStatus } : p
        )
      )
      setConfirmPoll(null)
    } catch {
      setError('Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('polly_user')
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="w-8 h-3 bg-gray-200 rounded" />
        <div className="flex items-center gap-4">
          <button className="text-gray-500">🔍</button>
          <button className="text-gray-500 relative">
            🔔
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button onClick={() => setMenuOpen(true)} className="text-gray-500">
            ☰
          </button>
        </div>
      </div>

      {/* Hamburger menu */}
      {menuOpen && (
        <HamburgerMenu
          user={user}
          onClose={() => setMenuOpen(false)}
          onLogout={handleLogout}
          router={router}
        />
      )}

      {/* Confirm modal */}
      {confirmPoll && (
        <ConfirmModal
          poll={confirmPoll}
          onConfirm={handleAdvancePoll}
          onCancel={() => setConfirmPoll(null)}
          loading={actionLoading}
        />
      )}

      <div className="px-4 py-5 max-w-lg mx-auto">
        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Stats row */}
        <div className="flex gap-3 mb-6">
          <StatCard label="Register User" value={totalRegistered} color="bg-pink-50" />
          <StatCard label="Vote Casted" value={totalVotes} color="bg-purple-50" />
        </div>

        {/* Poll list header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">All Poll</p>
          <p className="text-xs text-gray-400">{polls.length} Polls</p>
        </div>

        {/* Poll list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No polls yet.{' '}
            <button
              onClick={() => router.push('/admin/polls/new')}
              className="text-green-600 font-medium"
            >
              Create your first poll
            </button>
          </div>
        ) : (
          polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onClosePoll={(p) => setConfirmPoll(p)}
            />
          ))
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-6 py-3">
        <button className="flex flex-col items-center gap-1 text-green-600">
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => router.push('/admin/polls/new')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-lg">➕</span>
          <span className="text-[10px]">Create</span>
        </button>
        <button
          onClick={() => router.push('/admin/analytics')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">Analytics</span>
        </button>
        <button
          onClick={() => router.push('/admin/profile')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-lg">👤</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </div>

      {/* Bottom nav spacer */}
      <div className="h-20" />
    </div>
  )
}