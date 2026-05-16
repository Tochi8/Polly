'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

type PageState = 'loading' | 'join' | 'joining' | 'success' | 'already_member' | 'closed' | 'error'

export default function JoinCommunityPage() {
  const { invite_token } = useParams<{ invite_token: string }>()
  const router = useRouter()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [communityName, setCommunityName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('polly_user')
    if (!stored) {
      localStorage.setItem('polly_redirect', `/join/${invite_token}`)
      router.push('/login')
      return
    }

    const user = JSON.parse(stored)
    joinCommunity(user.id)
  }, [invite_token])

  async function joinCommunity(userId: string) {
    try {
      const res = await fetch('/api/communities/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_token, user_id: userId }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error?.includes('closed') || data.error?.includes('deadline')) {
          setCommunityName(data.community?.name ?? '')
          setPageState('closed')
          return
        }
        setError(data.error || 'Something went wrong')
        setPageState('error')
        return
      }

      setCommunityName(data.community?.name ?? '')

      if (data.alreadyMember) {
        setPageState('already_member')
      } else {
        setPageState('success')
      }
    } catch {
      setError('Something went wrong')
      setPageState('error')
    }
  }

  if (pageState === 'loading' || pageState === 'joining') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
      </div>
    )
  }

  if (pageState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">You're in!</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          You've successfully joined <span className="font-semibold text-gray-700">{communityName}</span>. You'll be able to register and vote when a poll goes live.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-xs bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] transition-colors"
        >
          Go to homepage
        </button>
      </div>
    )
  }

  if (pageState === 'already_member') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Already a member</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          You're already a member of <span className="font-semibold text-gray-700">{communityName}</span>. You'll be notified when a poll goes live.
        </p>
        <button
          onClick={() => router.push('/')}
          className="w-full max-w-xs bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] transition-colors"
        >
          Go to homepage
        </button>
      </div>
    )
  }

  if (pageState === 'closed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Registration closed</h2>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          Registration for <span className="font-semibold text-gray-700">{communityName}</span> is no longer open. Contact the community admin if you think this is a mistake.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-400">{error}</p>
    </div>
  )
}