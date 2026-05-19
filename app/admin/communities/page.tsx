'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

export default function CommunitiesPage() {
  const router = useRouter()
  const { user, mounted } = useUser('admin')

  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchCommunities = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/communities?created_by=${userId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to fetch communities')
        return
      }
      setCommunities(data.communities || [])
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.id) fetchCommunities(user.id)
  }, [user, fetchCommunities])

  function handleCopyInvite(community: Community) {
    const link = `${window.location.origin}/join/${community.invite_token}`
    navigator.clipboard.writeText(link)
    setCopiedId(community.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatDeadline(deadline: string | null): string {
    if (!deadline) return 'No deadline'
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (!mounted) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30 max-w-full">
        <button
          onClick={() => router.push('/admin')}
          className="text-gray-500 text-sm hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
          <span className="text-sm font-semibold text-gray-700">Communities</span>
        <button
          onClick={() => router.push('/admin/communities/new')}
          className="text-sm font-semibold text-[#2d5a1b] hover:text-[#254d17] transition-colors"
        >
          + New community
        </button>
      </div>
      <div className="px-4 lg:px-8 py-6 max-w-lg lg:max-w-4xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading communities...</div>
        ) : communities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">No communities yet</p>
            <p className="text-xs text-gray-400 mb-6">Create a community to gate your polls to verified members only.</p>
            <button
              onClick={() => router.push('/admin/communities/new')}
              className="bg-[#2d5a1b] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#254d17] transition-colors"
            >
              Create your first community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {communities.map((community) => (
              <div key={community.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{community.name}</p>
                    {community.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{community.description}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                    community.registration_open
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${community.registration_open ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {community.registration_open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <p className="text-xs text-gray-500">{community.memberCount} members</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <p className="text-xs text-gray-500">{formatDeadline(community.registration_deadline)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleCopyInvite(community)}
                    className="flex-1 text-xs font-semibold text-[#2d5a1b] border border-[#2d5a1b] rounded-xl py-2.5 hover:bg-green-50 transition-colors"
                  >
                    {copiedId === community.id ? 'Copied!' : 'Copy invite link'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/communities/${community.id}`)}
                    className="flex-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}