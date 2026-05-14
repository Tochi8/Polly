'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Poll, User } from '@/types/index'
import { useUser } from '@/hooks/useUser'
import { usePolls } from '@/hooks/usePolls'

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

function formatStatus(poll: Poll): 'completed' | 'live' | 'registration_open' | 'upcoming' | 'closed' {
  const now = new Date()
  if (!poll.registration_opens_at) return 'closed'
  if (now < new Date(poll.registration_opens_at)) return 'upcoming'
  if (now < new Date(poll.registration_closes_at)) return 'registration_open'
  if (now < new Date(poll.voting_opens_at)) return 'closed'
  if (now < new Date(poll.voting_closes_at)) return 'live'
  return 'completed'
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex-1 rounded-2xl p-4 ${color}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed' || status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Completed
      </span>
    )
  }
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        Live
      </span>
    )
  }
  if (status === 'registration_open') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Registration
      </span>
    )
  }
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Upcoming
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      Closed
    </span>
  )
}

function PollCard({
  poll,
  onClosePoll,
  onDelete,
}: {
  poll: Poll
  onClosePoll: (poll: Poll) => void
  onDelete: (poll: Poll) => void
}) {
  const status = formatStatus(poll)

  return (
    <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{poll.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Polygon Amoy</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p className="text-xs text-gray-500">{poll.registeredCount} registered</p>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <p className="text-xs text-gray-500">{poll.votesCount} votes</p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {(status === 'registration_open' || status === 'live') && (
            <button
              onClick={() => onClosePoll(poll)}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              Advance phase
            </button>
          )}
          <button
            onClick={() => onDelete(poll)}
            className="text-[11px] font-semibold text-red-400 border border-red-100 rounded-lg px-2.5 py-1 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmModal({ poll, onConfirm, onCancel, loading }: { poll: Poll; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  const status = formatStatus(poll)
  const nextStatus = status === 'registration_open' ? 'Live' : 'Complete'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-sm font-semibold text-gray-800">Confirm Phase Change</p>
        </div>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          You are about to advance this poll to <span className="text-gray-900 font-semibold">{nextStatus}</span>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 bg-[#2d5a1b] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#254d17] transition-colors disabled:opacity-50">
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ poll, onConfirm, onCancel, loading }: { poll: Poll; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <p className="text-sm font-semibold text-gray-800">Delete Poll</p>
        </div>
        <p className="text-sm text-gray-500 mb-1 leading-relaxed">You are about to delete</p>
        <p className="text-sm font-semibold text-gray-900 mb-4">"{poll.title}"</p>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          This will permanently remove the poll, all votes, and all registrations. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function HamburgerMenu({ user, onClose, onLogout, router }: { user: User; onClose: () => void; onLogout: () => void; router: ReturnType<typeof useRouter> }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute top-14 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-52" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#2d5a1b] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.username?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user.provider}</p>
          </div>
        </div>

        <button onClick={() => { router.push('/admin/settings'); onClose() }} className="flex items-center gap-3 w-full py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>

        <div className="border-t border-gray-100 mt-2 pt-2">
          <button onClick={onLogout} className="flex items-center gap-3 w-full py-2.5 text-sm text-red-500 hover:text-red-600 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function BottomNav({ router }: { router: ReturnType<typeof useRouter> }) {
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const items = [
    { label: 'Home', path: '/admin', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: 'Create', path: '/admin/polls/new', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { label: 'Analytics', path: '/admin/analytics', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { label: 'Profile', path: '/admin/profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 z-30 md:hidden">
      {items.map((item) => {
        const active = path === item.path
        return (
          <button key={item.path} onClick={() => router.push(item.path)} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${active ? 'text-[#2d5a1b]' : 'text-gray-400 hover:text-gray-600'}`}>
            {item.icon}
            <span className={`text-[10px] font-medium ${active ? 'text-[#2d5a1b]' : ''}`}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, mounted } = useUser('admin')
  const { polls, loading, error: pollsError, refetch } = usePolls(user?.id)

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmPoll, setConfirmPoll] = useState<Poll | null>(null)
  const [deleteConfirmPoll, setDeleteConfirmPoll] = useState<Poll | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalRegistered = polls.reduce((acc, p) => acc + p.registeredCount, 0)
  const totalVotes = polls.reduce((acc, p) => acc + p.votesCount, 0)

  const filteredPolls = polls.filter(poll => poll.title.toLowerCase().includes(searchQuery.toLowerCase()))

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
      if (!res.ok) { setError(data.error || 'Failed to update poll'); return }
      refetch()
      setConfirmPoll(null)
    } catch { setError('Something went wrong') } finally { setActionLoading(false) }
  }

  async function handleDeletePoll() {
    if (!deleteConfirmPoll) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/polls/${deleteConfirmPoll.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to delete poll'); return }
      refetch()
      setDeleteConfirmPoll(null)
    } catch { setError('Something went wrong') } finally { setDeleteLoading(false) }
  }

  function handleLogout() {
    localStorage.removeItem('polly_user')
    router.push('/')
  }

  if (!mounted || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-white"><div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <PollyLogo />

        {/* Desktop Navigation - Center with labels */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          <button onClick={() => router.push('/admin')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#2d5a1b] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button onClick={() => router.push('/admin/polls/new')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#2d5a1b] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span className="text-xs font-medium">Create</span>
          </button>

          <button onClick={() => router.push('/admin/analytics')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#2d5a1b] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-3">
          {searchOpen ? (
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
              placeholder="Search polls..."
              className="text-sm outline-none border-b border-gray-200 pb-0.5 w-36 md:w-80 text-gray-800 placeholder:text-gray-300 bg-transparent"
            />
          ) : (
            <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}

          <button onClick={() => router.push('/admin/notifications')} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors relative">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          <button onClick={() => setMenuOpen(true)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Modals */}
      {menuOpen && <HamburgerMenu user={user} onClose={() => setMenuOpen(false)} onLogout={handleLogout} router={router} />}
      {confirmPoll && <ConfirmModal poll={confirmPoll} onConfirm={handleAdvancePoll} onCancel={() => setConfirmPoll(null)} loading={actionLoading} />}
      {deleteConfirmPoll && <DeleteConfirmModal poll={deleteConfirmPoll} onConfirm={handleDeletePoll} onCancel={() => setDeleteConfirmPoll(null)} loading={deleteLoading} />}

      {/* Main Content */}
      <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
        {(error || pollsError) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error || pollsError}
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <StatCard label="Registered" value={totalRegistered} color="bg-pink-50" />
          <StatCard label="Votes Cast" value={totalVotes} color="bg-purple-50" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-gray-900">All Polls</p>
          <p className="text-sm text-gray-400">{filteredPolls.length} total</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading polls...</div>
        ) : filteredPolls.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            {searchQuery ? `No polls found for "${searchQuery}"` : 'No polls yet.'}{' '}
            {!searchQuery && <button onClick={() => router.push('/admin/polls/new')} className="text-[#2d5a1b] font-medium">Create your first poll</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onClosePoll={(p) => setConfirmPoll(p)} onDelete={(p) => setDeleteConfirmPoll(p)} />
            ))}
          </div>
        )}
      </div>

      <BottomNav router={router} />
      <div className="h-20 md:hidden" />
    </div>
  )
}