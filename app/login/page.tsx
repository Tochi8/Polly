'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

type Role = 'admin' | 'voter' | null
type AuthProvider = 'discord' | 'x' | 'telegram'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState<AuthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError('Sign in failed. Please try again.')
    }
  }, [searchParams])

  useEffect(() => {
    ;(window as any).onTelegramAuth = handleTelegramLogin

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    const container = document.getElementById('telegram-login-container')
    if (container) container.appendChild(script)

    return () => {
      if (container) container.innerHTML = ''
      delete (window as any).onTelegramAuth
    }
  }, [role])

  async function handleSignIn(provider: AuthProvider) {
    if (!role) {
      setError('Please select how you want to use Polly first.')
      return
    }
    setLoading(provider)
    setError(null)

    const redirect = localStorage.getItem('polly_redirect') ?? ''
    document.cookie = `polly_auth_role=${role}; path=/; max-age=600`
    document.cookie = `polly_auth_redirect=${redirect}; path=/; max-age=600`

    const supabase = createSupabaseBrowserClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'discord' | 'x',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'discord' ? 'identify email' : undefined,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(null)
    }
  }

  async function handleTelegramLogin(telegramData: TelegramAuthData) {
    if (!role) {
      setError('Please select how you want to use Polly first.')
      return
    }

    setLoading('telegram')
    setError(null)

    try {
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramData, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Telegram login failed')
        setLoading(null)
        return
      }

      localStorage.setItem('polly_user', JSON.stringify(data.user))

      const redirect = localStorage.getItem('polly_redirect')
      if (redirect) {
        localStorage.removeItem('polly_redirect')
        router.push(redirect)
        return
      }

      if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch {
      setError('Something went wrong with Telegram login')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md md:max-w-lg">

        {/* Logo */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Polly</h1>
          <p className="text-sm text-gray-400">
            Verified voting for real communities
          </p>
        </div>

        {/* Role selection */}
        <div className="mb-8 md:mb-10">
          <p className="text-sm font-medium text-gray-600 mb-3 text-center">
            I want to...
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setRole('admin'); setError(null) }}
              className={`flex-1 py-4 rounded-2xl text-sm font-semibold border-2 transition-all ${
                role === 'admin'
                  ? 'border-[#2d5a1b] bg-[#2d5a1b] text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              Create a poll
            </button>
            <button
              onClick={() => { setRole('voter'); setError(null) }}
              className={`flex-1 py-4 rounded-2xl text-sm font-semibold border-2 transition-all ${
                role === 'voter'
                  ? 'border-[#2d5a1b] bg-[#2d5a1b] text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              Vote
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Social login buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSignIn('discord')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white rounded-2xl py-4 font-semibold text-sm hover:bg-[#4752c4] transition-colors disabled:opacity-50"
          >
            {loading === 'discord' ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.3 4.4A19.7 19.7 0 0015.5 3c-.2.4-.5.9-.7 1.3a18.2 18.2 0 00-5.5 0C9.1 3.9 8.8 3.4 8.6 3A19.6 19.6 0 003.7 4.4C.5 9.1-.3 13.7.1 18.2a19.8 19.8 0 006 3c.5-.6.9-1.3 1.2-2a13 13 0 01-1.9-.9l.5-.4a14.1 14.1 0 0012.2 0l.5.4c-.6.3-1.2.7-1.9.9.3.7.8 1.4 1.2 2a19.7 19.7 0 006-3c.5-5.1-.8-9.6-3.6-13.8zM8.5 15.4c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4zm7 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z"/>
              </svg>
            )}
            Continue with Discord
          </button>

          <button
            onClick={() => handleSignIn('x')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-2xl py-4 font-semibold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading === 'x' ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18.3 1.6h3.4L14.5 10l8.5 11.2h-7l-4.9-6.4-5.7 6.4H2l7.7-8.7L1.7 1.6h7.2l4.5 5.9 5-5.9zm-1.2 18.6h1.9L7 3.5H4.9l12.2 16.7z"/>
              </svg>
            )}
            Continue with X
          </button>

          {/* Telegram widget container */}
          <div id="telegram-login-container" className="w-full flex justify-center pt-2" />
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-10 leading-relaxed px-4">
          By continuing you confirm you are a community member.{' '}
          One account per person, verified by identity.
        </p>

      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  )
}