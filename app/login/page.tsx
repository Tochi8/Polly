'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase'

type Role = 'admin' | 'voter' | null
type AuthProvider = 'discord' | 'x' | 'google'

function LoginContent() {
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
      provider: provider as 'discord' | 'x' | 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'discord' ? 'identify email' : provider === 'google' ? 'email profile' : undefined,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md md:max-w-lg">

        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Polly</h1>
          <p className="text-sm text-gray-400">
            Verified voting for online communities
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Social login buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSignIn('google')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading === 'google' ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

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
        </div>

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