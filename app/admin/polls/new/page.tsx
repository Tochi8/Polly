'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

const ALL_PROVIDERS: { key: string; label: string; icon: React.ReactNode }[] = [
  { key: 'x', label: 'X (Twitter)', icon: <XIcon /> },
  { key: 'discord', label: 'Discord', icon: <DiscordIcon /> },
  { key: 'google', label: 'Google', icon: <GoogleIcon /> },
]

interface Community {
  id: string
  name: string
  memberCount: number
  registration_open: boolean
}

interface PollForm {
  image: File | null
  imagePreview: string | null
  question: string
  options: string[]
  communityId: string
  registrationOpens: string
  registrationCloses: string
  votingOpens: string
  votingCloses: string
  allowedProviders: string[]
}

function validateForm(form: PollForm): string | null {
  if (!form.question.trim()) return 'Please enter a question'
  const validOptions = form.options.filter(o => o.trim().length > 0)
  if (validOptions.length < 2) return 'Please add at least two options'
  if (!form.communityId) return 'Please select a community for this poll'
  if (!form.registrationOpens) return 'Please set when registration opens'
  if (!form.registrationCloses) return 'Please set when registration closes'
  if (!form.votingOpens) return 'Please set when voting opens'
  if (!form.votingCloses) return 'Please set when voting closes'
  const regOpens = new Date(form.registrationOpens)
  const regCloses = new Date(form.registrationCloses)
  const voteOpens = new Date(form.votingOpens)
  const voteCloses = new Date(form.votingCloses)
  const now = new Date()
  if (regOpens < now) return 'Registration open time must be in the future'
  if (regCloses <= regOpens) return 'Registration must close after it opens'
  if (voteOpens <= regCloses) return 'Voting must open after registration closes'
  if (voteCloses <= voteOpens) return 'Voting must close after it opens'
  if (form.allowedProviders.length === 0) return 'Please select at least one allowed platform'
  return null
}

export default function NewPollPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [communities, setCommunities] = useState<Community[]>([])
  const [communitiesLoading, setCommunitiesLoading] = useState(true)

  const [form, setForm] = useState<PollForm>({
    image: null,
    imagePreview: null,
    question: '',
    options: ['', ''],
    communityId: '',
    registrationOpens: '',
    registrationCloses: '',
    votingOpens: '',
    votingCloses: '',
    allowedProviders: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchCommunities = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('polly_user') || '{}')
      const res = await fetch(`/api/communities?created_by=${user.id}`)
      const data = await res.json()
      if (res.ok) setCommunities(data.communities || [])
    } catch {
      
    } finally {
      setCommunitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCommunities()
  }, [fetchCommunities])

  function updateField<K extends keyof PollForm>(key: K, val: PollForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, image: file, imagePreview: preview }))
  }

  function updateOption(i: number, val: string) {
    const opts = [...form.options]
    opts[i] = val
    updateField('options', opts)
  }

  function addOption() {
    updateField('options', [...form.options, ''])
  }

  function removeOption(i: number) {
    if (form.options.length <= 2) return
    updateField('options', form.options.filter((_, idx) => idx !== i))
  }

  function toggleProvider(key: string) {
    const current = form.allowedProviders
    if (current.includes(key)) {
      updateField('allowedProviders', current.filter(p => p !== key))
    } else {
      updateField('allowedProviders', [...current, key])
    }
  }

  function toLocalISO(localDatetime: string): string {
    const offset = -new Date().getTimezoneOffset()
    const sign = offset >= 0 ? '+' : '-'
    const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0')
    const offsetStr = sign + pad(offset / 60) + ':' + pad(offset % 60)
    return localDatetime + offsetStr
  }

  function handleCopy() {
    if (!createdLink) return
    navigator.clipboard.writeText(createdLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handlePublish() {
    const validationError = validateForm(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const user = JSON.parse(localStorage.getItem('polly_user') || '{}')
      const validOptions = form.options.filter(o => o.trim().length > 0)

      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.question,
          description: '',
          results_public: true,
          created_by: user.id,
          community_id: form.communityId,
          registration_opens_at: toLocalISO(form.registrationOpens),
          registration_closes_at: toLocalISO(form.registrationCloses),
          voting_opens_at: toLocalISO(form.votingOpens),
          voting_closes_at: toLocalISO(form.votingCloses),
          candidates: validOptions.map(name => ({ name, description: '' })),
          allowed_providers: form.allowedProviders,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create poll')
        return
      }

      setCreatedLink(`${window.location.origin}/vote/${data.poll.token}`)
    } catch {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const isValid =
    form.question.trim().length > 0 &&
    form.options.filter(o => o.trim().length > 0).length >= 2 &&
    form.communityId !== '' &&
    form.registrationOpens &&
    form.registrationCloses &&
    form.votingOpens &&
    form.votingCloses &&
    form.allowedProviders.length > 0

  if (createdLink) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button onClick={() => router.push('/admin')} className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
            ← Back to dashboard
          </button>
          <span className="text-sm font-semibold text-gray-700">Poll Created</span>
          <div className="w-24" />
        </div>

        <div className="px-4 md:px-8 py-10 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Poll published</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
            Share this link with your community to let them register and vote.
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-left">
            <p className="text-xs text-gray-400 mb-2">Poll link</p>
            <p className="text-sm font-mono text-gray-700 break-all leading-relaxed">{createdLink}</p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] transition-colors mb-3"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>

          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-white border border-gray-200 text-gray-600 rounded-2xl py-4 font-semibold text-[15px] hover:bg-gray-50 transition-colors"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button onClick={() => router.back()} className="text-gray-500 text-sm hover:text-gray-800 transition-colors">
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Create New Poll</span>
        <div className="w-10" />
      </div>

      <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Image upload */}
        <div
          className="relative mb-8 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
          style={{ aspectRatio: '16/7' }}
          onClick={() => fileRef.current?.click()}
        >
          {form.imagePreview ? (
            <>
              <img src={form.imagePreview} alt="Poll cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, image: null, imagePreview: null })) }}
                className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span className="text-sm">Add cover image (optional)</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Question */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Question</label>
          <input
            type="text"
            placeholder="What do you want your community to decide?"
            value={form.question}
            onChange={e => updateField('question', e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-base outline-none focus:border-gray-400 bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Options</label>
          <div className="flex flex-col gap-3">
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-2xl px-5 py-4 text-base outline-none focus:border-gray-400 bg-white placeholder:text-gray-400"
                />
                {form.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)} className="text-gray-300 hover:text-red-400 text-xl w-10 h-10 flex items-center justify-center">
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="text-left text-sm text-gray-400 hover:text-gray-600 px-5 py-4 border border-dashed border-gray-200 rounded-2xl">
              + Add another option
            </button>
          </div>
        </div>

        {/* Community */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Community</label>
          {communitiesLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-sm text-gray-400">Loading communities...</div>
          ) : communities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500 mb-3">You don't have any communities yet. Create one first before publishing a poll.</p>
              <button
                onClick={() => router.push('/admin/communities/new')}
                className="text-sm font-semibold text-[#2d5a1b] hover:text-[#254d17] transition-colors"
              >
                Create a community →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {communities.map((community, i) => {
                const isSelected = form.communityId === community.id
                return (
                  <button
                    key={community.id}
                    onClick={() => updateField('communityId', community.id)}
                    className={`flex items-center justify-between w-full px-5 py-4 transition-colors ${i < communities.length - 1 ? 'border-b border-gray-50' : ''} ${isSelected ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{community.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{community.memberCount} members · {community.registration_open ? 'Registration open' : 'Registration closed'}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-[#2d5a1b] bg-[#2d5a1b]' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Allowed Platforms */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Allowed Platforms</label>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {ALL_PROVIDERS.map((provider, i) => {
              const isSelected = form.allowedProviders.includes(provider.key)
              return (
                <button
                  key={provider.key}
                  onClick={() => toggleProvider(provider.key)}
                  className={`flex items-center justify-between w-full px-5 py-4 text-base transition-colors ${i < ALL_PROVIDERS.length - 1 ? 'border-b border-gray-50' : ''} ${isSelected ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span>{provider.icon}</span>
                    <span className={isSelected ? 'text-gray-900' : 'text-gray-500'}>{provider.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#2d5a1b] bg-[#2d5a1b]' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Timeline</label>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {[
              { label: 'Registration opens', key: 'registrationOpens' as const },
              { label: 'Registration closes', key: 'registrationCloses' as const },
              { label: 'Voting opens', key: 'votingOpens' as const },
              { label: 'Voting closes', key: 'votingCloses' as const },
            ].map((item, index) => (
              <div key={item.key} className={`px-5 py-4 ${index !== 3 ? 'border-b border-gray-50' : ''}`}>
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <input
                  type="datetime-local"
                  value={form[item.key]}
                  onChange={e => updateField(item.key, e.target.value)}
                  className="w-full text-base text-gray-800 outline-none bg-transparent"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-[10px] text-gray-400 text-center leading-tight">Reg<br/>opens</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <p className="text-[10px] text-gray-400 text-center leading-tight">Reg<br/>closes</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-[10px] text-gray-400 text-center leading-tight">Vote<br/>opens</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-[10px] text-gray-400 text-center leading-tight">Vote<br/>closes</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          disabled={!isValid || loading || communities.length === 0}
          className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-lg disabled:opacity-40 hover:bg-[#254d17] transition-colors"
        >
          {loading ? 'Publishing Poll...' : 'Publish Poll'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
          Once published the poll will automatically open for registration at the time you set.
        </p>
      </div>
    </div>
  )
}