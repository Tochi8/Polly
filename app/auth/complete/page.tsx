'use client'

export const dynamic = 'force-dynamic'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const userParam = searchParams.get('user')
    const error = searchParams.get('error')

    if (error) {
      router.push('/login?error=auth_failed')
      return
    }

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        localStorage.setItem('polly_user', JSON.stringify(user))

        const redirect = localStorage.getItem('polly_redirect')
        if (redirect) {
          localStorage.removeItem('polly_redirect')
          router.push(redirect)
          return
        }

        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } catch {
        router.push('/login?error=auth_failed')
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
    </div>
  )
}

export default function AuthComplete() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-green-500 animate-spin" />
      </div>
    }>
      <AuthCompleteContent />
    </Suspense>
  )
}