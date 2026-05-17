'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

export default function SettingsPage() {
  const router = useRouter()
  const { user, mounted } = useUser('admin')

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)

  const [voteNotif, setVoteNotif] = useState(true)
  const [regNotif, setRegNotif] = useState(false)

  useEffect(() => {
  if (user?.notification_preferences) {
    setVoteNotif(user.notification_preferences.vote_notifications ?? true)
    setRegNotif(user.notification_preferences.registration_alerts ?? false)
  }
}, [user])

  async function handleToggleNotification(key: string, value: boolean) {
    if (!user) return
  try {
    await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notification_preferences: {
          vote_notifications: key === 'vote_notifications' ? value : voteNotif,
          registration_alerts: key === 'registration_alerts' ? value : regNotif,
        },
      }),
    })
  } catch {

  }
}

  async function handleUpdateUsername() {
    if (!user || !newUsername.trim()) return
    setUsernameLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update username')
        return
      }

      const stored = JSON.parse(localStorage.getItem('polly_user') || '{}')
      localStorage.setItem('polly_user', JSON.stringify({ ...stored, username: data.user.username }))

      setSuccess('Username updated successfully')
      setEditingUsername(false)
      setNewUsername('')

      window.location.reload()
    } catch {
      setError('Something went wrong')
    } finally {
      setUsernameLoading(false)
    }
  }

  async function handleDeleteAccount() {
    if (!user) return
    setDeleteLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to delete account')
        return
      }

      localStorage.removeItem('polly_user')
      router.push('/')
    } catch {
      setError('Something went wrong')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!mounted || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Settings</span>
        <div className="w-10" />
      </div>

      <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">
            {success}
          </div>
        )}

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Account</p>
          </div>

          <div className="px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2d5a1b] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.username?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user.provider}</p>
              </div>
            </div>
            <button
              onClick={() => { setEditingUsername(true); setNewUsername(user.username) }}
              className="text-xs font-semibold text-[#2d5a1b] border border-[#2d5a1b] rounded-lg px-3 py-1.5 hover:bg-green-50 transition-colors"
            >
              Edit name
            </button>
          </div>

          {editingUsername && (
            <div className="px-4 py-4 border-t border-gray-50">
              <p className="text-xs text-gray-500 mb-2">New display name</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-gray-400 bg-white"
                />
                <button
                  onClick={handleUpdateUsername}
                  disabled={usernameLoading || !newUsername.trim()}
                  className="bg-[#2d5a1b] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#254d17] transition-colors disabled:opacity-50"
                >
                  {usernameLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingUsername(false); setNewUsername('') }}
                  className="border border-gray-200 text-gray-500 text-sm px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Note: This only changes your display name on Polly, not on {user.provider}.
              </p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Notifications</p>
          </div>

          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Vote notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Get notified when someone votes on your poll</p>
            </div>
            <button
              onClick={() => {
              const next = !voteNotif
              setVoteNotif(next)
              handleToggleNotification('vote_notifications', next)
            }}
              className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${voteNotif ? 'bg-[#2d5a1b] justify-end' : 'bg-gray-200 justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>

          <div className="px-4 py-4 flex items-center justify-between border-t border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Registration alerts</p>
              <p className="text-xs text-gray-400 mt-0.5">Get notified when someone registers for your poll</p>
            </div>
            <button
              onClick={() => {
              const next = !regNotif
              setRegNotif(next)
              handleToggleNotification('registration_alerts', next)
            }}
              className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${regNotif ? 'bg-[#2d5a1b] justify-end' : 'bg-gray-200 justify-start'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-red-50">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Danger Zone</p>
          </div>
          <div className="px-4 py-4">
            <p className="text-sm font-medium text-gray-800 mb-1">Delete account</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Permanently deletes your account and all polls, votes, and registrations associated with it. This cannot be undone.
            </p>

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-sm font-semibold text-red-500 border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-50 transition-colors"
              >
                Delete my account
              </button>
            ) : (
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">Are you absolutely sure?</p>
                <p className="text-xs text-red-500 leading-relaxed mb-4">
                  This will delete your account, all your polls, all votes cast, and all registrations. There is no way to recover this data.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="flex-1 border border-gray-200 bg-white rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleteLoading ? 'Deleting...' : 'Yes, delete everything'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}