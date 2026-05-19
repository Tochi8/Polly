'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

interface Community {
  id: string
  name: string
  description: string
  invite_token: string
  registration_open: boolean
  registration_deadline: string | null
  created_at: string
  memberCount: number
}

interface Member {
  id: string
  user_id: string
  username: string
  provider: string
  joined_at: string
}

function getProviderIcon(provider: string) {
  if (provider === 'discord') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  )
  if (provider === 'x') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
  if (provider === 'google') return (
    <svg width="13" height="13" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
  return null
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export default function CommunityDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { user, mounted } = useUser('admin')

  const [community, setCommunity] = useState<Community | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)

  const fetchCommunity = useCallback(async () => {
    try {
      const [communityRes, membersRes] = await Promise.all([
        fetch(`/api/communities/${id}`),
        fetch(`/api/communities/${id}/members`),
      ])

      const communityData = await communityRes.json()
      const membersData = await membersRes.json()

      if (!communityRes.ok) {
        setError(communityData.error || 'Failed to fetch community')
        return
      }

      setCommunity(communityData.community)
      setMembers(membersData.members || [])
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (user?.id) fetchCommunity()
  }, [user, fetchCommunity])

  function handleCopyInvite() {
    if (!community) return
    const link = `${window.location.origin}/join/${community.invite_token}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleToggleRegistration() {
  if (!community) return
  setToggling(true)
  try {
    const isReopening = !community.registration_open
    const res = await fetch(`/api/communities/${community.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registration_open: !community.registration_open,
        ...(isReopening && { registration_deadline: null }),
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setCommunity(prev => prev ? {
        ...prev,
        registration_open: data.community.registration_open,
        registration_deadline: isReopening ? null : prev.registration_deadline,
      } : prev)
    }
  } catch {
    setError('Failed to update registration status')
  } finally {
    setToggling(false)
  }
}

  if (!mounted || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => router.push('/admin/communities')}
          className="text-gray-500 text-sm hover:text-gray-800 transition-colors"
        >
          ← Communities
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {community?.name ?? 'Community'}
        </span>
        <div className="w-16" />
      </div>

      <div className="px-4 lg:px-8 py-6 max-w-lg lg:max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : community && (
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Left column */}
            <div className="lg:col-span-1 mb-4 lg:mb-0">
              {/* Community info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                <p className="text-base font-bold text-gray-900 mb-1">{community.name}</p>
                {community.description && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{community.description}</p>
                )}

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Members</p>
                    <p className="text-xs font-semibold text-gray-800">{community.memberCount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Registration</p>
                    <span className={`text-xs font-semibold ${community.registration_open ? 'text-green-600' : 'text-gray-500'}`}>
                      {community.registration_open ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  {community.registration_deadline && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Deadline</p>
                      <p className="text-xs font-semibold text-gray-800">{formatDate(community.registration_deadline)}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Created</p>
                    <p className="text-xs font-semibold text-gray-800">{formatDate(community.created_at)}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyInvite}
                  className="w-full text-xs font-semibold text-[#2d5a1b] border border-[#2d5a1b] rounded-xl py-2.5 hover:bg-green-50 transition-colors mb-2"
                >
                  {copied ? 'Copied!' : 'Copy invite link'}
                </button>

                <button
                  onClick={handleToggleRegistration}
                  disabled={toggling}
                  className={`w-full text-xs font-semibold rounded-xl py-2.5 transition-colors disabled:opacity-50 ${
                    community.registration_open
                      ? 'text-red-500 border border-red-200 hover:bg-red-50'
                      : 'text-green-600 border border-green-200 hover:bg-green-50'
                  }`}
                >
                  {toggling ? 'Updating...' : community.registration_open ? 'Close registration' : 'Reopen registration'}
                </button>
              </div>
            </div>

            {/* Right column — members list */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Members</p>
                  <p className="text-xs text-gray-400">{members.length} total</p>
                </div>

                {members.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No members yet. Share the invite link to get started.
                  </div>
                ) : (
                  <div>
                    {members.map((member, i) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between px-5 py-3.5 ${i < members.length - 1 ? 'border-b border-gray-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            {member.username?.[0]?.toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">@{member.username}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {getProviderIcon(member.provider)}
                              <p className="text-[11px] text-gray-400 capitalize">{member.provider}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(member.joined_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}