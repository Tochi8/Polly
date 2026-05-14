'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'

interface Notification {
  id: string
  username: string
  provider: string
  pollTitle: string
  pollClosesAt: string
  createdAt: string
}

interface NotificationGroup {
  label: string
  items: Notification[]
}

function getGroupLabel(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return 'This week'
  if (diffDays <= 14) return '2 weeks ago'
  if (diffDays <= 30) return 'This month'
  return 'Earlier'
}

function groupNotifications(notifications: Notification[]): NotificationGroup[] {
  const groups: Record<string, Notification[]> = {}
  notifications.forEach((n) => {
    const label = getGroupLabel(n.createdAt)
    if (!groups[label]) groups[label] = []
    groups[label].push(n)
  })
  const order = ['Today', 'Yesterday', 'This week', '2 weeks ago', 'This month', 'Earlier']
  return order.filter((label) => groups[label]).map((label) => ({ label, items: groups[label] }))
}

function formatPollDates(closesAt: string): string {
  if (!closesAt) return ''
  return new Date(closesAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getProviderIcon(provider: string): string {
  if (provider === 'discord') return '💬'
  if (provider === 'twitter') return '🐦'
  if (provider === 'telegram') return '✈️'
  return '👤'
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useUser('admin')

  const [groups, setGroups] = useState<NotificationGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/notifications?admin_id=${userId}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to fetch notifications')
        return
      }
      setGroups(groupNotifications(data.notifications || []))
    } catch {
      setError('Something went wrong fetching notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.id) fetchNotifications(user.id)
  }, [user, fetchNotifications])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button onClick={() => router.back()} className="text-gray-500 text-sm hover:text-gray-800">
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Notification</span>
        <div className="w-10" />
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No notifications yet. Votes on your polls will appear here.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-gray-400 mb-3">{group.label}</p>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {group.items.map((notification, i) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between px-4 py-3 ${i < group.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
                          {getProviderIcon(notification.provider)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            <span className="font-semibold">@{notification.username}</span> voted
                          </p>
                          <p className="text-xs text-gray-400 truncate">{notification.pollTitle}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatPollDates(notification.pollClosesAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  )
}