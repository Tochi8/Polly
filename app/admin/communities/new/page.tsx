'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

export default function NewCommunityPage() {
  const router = useRouter()
  const { user, mounted } = useUser('admin')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCreate() {
    if (!name.trim()) {
      setError('Please enter a community name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          created_by: user?.id,
          registration_deadline: deadline ? new Date(deadline).toISOString() : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create community')
        return
      }

      setCreatedInviteLink(`${window.location.origin}/join/${data.community.invite_token}`)
    } catch {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!createdInviteLink) return
    navigator.clipboard.writeText(createdInviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )

  if (createdInviteLink) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button
            onClick={() => router.push('/admin/communities')}
            className="text-gray-500 text-sm hover:text-gray-800 transition-colors"
          >
            ← Communities
          </button>
          <span className="text-sm font-semibold text-gray-700">Community Created</span>
          <div className="w-16" />
        </div>

        <div className="px-4 lg:px-8 py-10 max-w-lg lg:max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Community created</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
            Share this invite link with your community. Anyone who clicks it and signs in will be automatically added as a member.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-left">
            <p className="text-xs text-gray-400 mb-2">Invite link</p>
            <p className="text-sm font-mono text-gray-700 break-all leading-relaxed">{createdInviteLink}</p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] transition-colors mb-3"
          >
            {copied ? 'Copied!' : 'Copy invite link'}
          </button>

          <button
            onClick={() => router.push('/admin/communities')}
            className="w-full bg-white border border-gray-200 text-gray-600 rounded-2xl py-4 font-semibold text-[15px] hover:bg-gray-50 transition-colors"
          >
            Go to communities
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => router.push('/admin/communities')}
          className="text-gray-500 text-sm hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">New Community</span>
        <div className="w-10" />
      </div>

      <div className="px-4 lg:px-8 py-6 max-w-lg lg:max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Community name
          </label>
          <input
            type="text"
            placeholder="e.g. Crypto Street DAO"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Description <span className="text-gray-300 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="What is this community about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300 resize-none"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Registration deadline <span className="text-gray-300 normal-case font-normal">(optional)</span>
          </label>
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="datetime-local"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full text-sm text-gray-800 outline-none bg-transparent"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            After this date, new members cannot join. Leave empty to close registration manually.
          </p>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim() || loading}
          className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-[#254d17] transition-colors"
        >
          {loading ? 'Creating...' : 'Create Community'}
        </button>
      </div>
    </div>
  )
}