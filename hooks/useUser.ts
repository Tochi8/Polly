'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/index'

export function useUser(requiredRole?: 'admin' | 'voter') {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('polly_user')
    if (!stored) {
      router.push('/login')
      return
    }
    const parsed: User = JSON.parse(stored)
    if (requiredRole && parsed.role !== requiredRole) {
      router.push('/')
      return
    }
    setUser(parsed)
  }, [])

  return { user, mounted }
}