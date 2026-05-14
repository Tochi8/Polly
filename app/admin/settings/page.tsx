'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

export default function SettingsPage() {
  const router = useRouter()
  const { user, mounted } = useUser('admin')

  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm hover:text-gray-800 transition-colors flex items-center gap-1.5"
        >
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Settings</span>
        <div className="w-10" />
      </div>

      {/* Main Content */}
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
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d5a1b] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.username?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user.provider}</p>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400 leading-relaxed">
              Your display name is pulled from your {user.provider} account and cannot be changed here. To update it, change your name on {user.provider} and sign in again.
            </p>
          </div>
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
            <div className="w-10 h-6 rounded-full bg-[#2d5a1b] flex items-center justify-end px-0.5 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </div>
          </div>
          <div className="px-4 py-4 flex items-center justify-between border-t border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Registration alerts</p>
              <p className="text-xs text-gray-400 mt-0.5">Get notified when someone registers for your poll</p>
            </div>
            <div className="w-10 h-6 rounded-full bg-gray-200 flex items-center px-0.5 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </div>
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