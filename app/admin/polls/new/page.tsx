'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PollForm {
  image: File | null
  imagePreview: string | null
  question: string
  options: string[]
  registrationOpens: string
  registrationCloses: string
  votingOpens: string
  votingCloses: string
}

function validateForm(form: PollForm): string | null {
  if (!form.question.trim()) return 'Please enter a question'

  const validOptions = form.options.filter(o => o.trim().length > 0)
  if (validOptions.length < 2) return 'Please add at least two options'

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

  return null
}

export default function NewPollPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<PollForm>({
    image: null,
    imagePreview: null,
    question: '',
    options: ['', ''],
    registrationOpens: '',
    registrationCloses: '',
    votingOpens: '',
    votingCloses: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  function toLocalISO(localDatetime: string): string {
  const offset = -new Date().getTimezoneOffset()
  const sign = offset >= 0 ? '+' : '-'
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0')
  const offsetStr = sign + pad(offset / 60) + ':' + pad(offset % 60)
  return localDatetime + offsetStr
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
          registration_opens_at: toLocalISO(form.registrationOpens),
          registration_closes_at: toLocalISO(form.registrationCloses),
          voting_opens_at: toLocalISO(form.votingOpens),
          voting_closes_at: toLocalISO(form.votingCloses),
          candidates: validOptions.map(name => ({ name, description: '' })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create poll')
        return
      }

      router.push('/admin')
    } catch {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const isValid =
    form.question.trim().length > 0 &&
    form.options.filter(o => o.trim().length > 0).length >= 2 &&
    form.registrationOpens &&
    form.registrationCloses &&
    form.votingOpens &&
    form.votingCloses

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm hover:text-gray-800"
        >
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Create Poll</span>
        <div className="w-10" />
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Image upload */}
        <div
          className="relative mb-6 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
          style={{ aspectRatio: '16/7' }}
          onClick={() => fileRef.current?.click()}
        >
          {form.imagePreview ? (
            <>
              <img
                src={form.imagePreview}
                alt="Poll cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setForm(prev => ({ ...prev, image: null, imagePreview: null }))
                }}
                className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span className="text-xs">Tap to add cover image (optional)</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {/* Question */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Question
          </label>
          <input
            type="text"
            placeholder="What do you want your community to decide?"
            value={form.question}
            onChange={e => updateField('question', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300"
          />
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Options
          </label>
          <div className="flex flex-col gap-2">
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300"
                />
                {form.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none w-8 h-8 flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-left text-sm text-gray-400 hover:text-gray-600 px-4 py-2 border border-dashed border-gray-200 rounded-xl"
            >
              + Add option
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Timeline
          </label>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Registration opens */}
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 mb-1">Registration opens</p>
              <input
                type="datetime-local"
                value={form.registrationOpens}
                onChange={e => updateField('registrationOpens', e.target.value)}
                className="w-full text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>

            {/* Registration closes */}
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 mb-1">Registration closes</p>
              <input
                type="datetime-local"
                value={form.registrationCloses}
                onChange={e => updateField('registrationCloses', e.target.value)}
                className="w-full text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>

            {/* Voting opens */}
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 mb-1">Voting opens</p>
              <input
                type="datetime-local"
                value={form.votingOpens}
                onChange={e => updateField('votingOpens', e.target.value)}
                className="w-full text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>

            {/* Voting closes */}
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Voting closes</p>
              <input
                type="datetime-local"
                value={form.votingCloses}
                onChange={e => updateField('votingCloses', e.target.value)}
                className="w-full text-sm text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Timeline visual guide */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-[10px] text-gray-400 text-center">Reg<br/>opens</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <p className="text-[10px] text-gray-400 text-center">Reg<br/>closes</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-[10px] text-gray-400 text-center">Vote<br/>opens</p>
            </div>
            <div className="flex-1 h-px bg-gray-200 mx-1" />
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <p className="text-[10px] text-gray-400 text-center">Vote<br/>closes</p>
            </div>
          </div>
        </div>

        {/* Publish button */}
        <button
          type="button"
          onClick={handlePublish}
          disabled={!isValid || loading}
          className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-[#254d17] transition-colors"
        >
          {loading ? 'Publishing...' : 'Publish Poll'}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
          Once published the poll will automatically open for registration at the time you set.
        </p>
      </div>
    </div>
  )
}