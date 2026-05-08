'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PollSection {
  image: File | null
  imagePreview: string | null
  question: string
  options: string[]
  pollDays: number
  pollHours: number
  pollMinutes: number
  pollSeconds: number
  allowMultiple: boolean
}

const emptySection = (): PollSection => ({
  image: null,
  imagePreview: null,
  question: '',
  options: ['', ''],
  pollDays: 1,
  pollHours: 0,
  pollMinutes: 0,
  pollSeconds: 0,
  allowMultiple: false,
})

function deadlineFromSection(s: PollSection): string {
  const ms =
    s.pollDays * 86400000 +
    s.pollHours * 3600000 +
    s.pollMinutes * 60000 +
    s.pollSeconds * 1000
  return new Date(Date.now() + ms).toISOString()
}

function NumberScroller({
  value,
  onChange,
  max,
}: {
  value: number
  onChange: (v: number) => void
  max: number
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(value < max ? value + 1 : 0)}
        className="text-gray-400 hover:text-gray-700 text-lg leading-none select-none"
      >
        ▲
      </button>
      <span className="text-base font-semibold w-8 text-center tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => onChange(value > 0 ? value - 1 : max)}
        className="text-gray-400 hover:text-gray-700 text-lg leading-none select-none"
      >
        ▼
      </button>
    </div>
  )
}

function SectionForm({
  section,
  index,
  onChange,
  isLast,
  onContinue,
  onPublish,
  loading,
}: {
  section: PollSection
  index: number
  onChange: (updated: PollSection) => void
  isLast: boolean
  onContinue: () => void
  onPublish: () => void
  loading: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [pollLengthOpen, setPollLengthOpen] = useState(false)

  function updateField<K extends keyof PollSection>(key: K, val: PollSection[K]) {
    onChange({ ...section, [key]: val })
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    onChange({ ...section, image: file, imagePreview: preview })
  }

  function updateOption(i: number, val: string) {
    const opts = [...section.options]
    opts[i] = val
    onChange({ ...section, options: opts })
  }

  function addOption() {
    onChange({ ...section, options: [...section.options, ''] })
  }

  function removeOption(i: number) {
    if (section.options.length <= 2) return
    const opts = section.options.filter((_, idx) => idx !== i)
    onChange({ ...section, options: opts })
  }

  const isValid =
    section.question.trim().length > 0 &&
    section.options.filter((o) => o.trim().length > 0).length >= 2

  return (
    <div className="mb-8">
      {/* Section label */}
      <p className="text-[#2563eb] font-semibold text-sm mb-3">
        Section {index + 1}
      </p>

      {/* Image upload */}
      <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-100 aspect-[16/7] flex items-center justify-center">
        {section.imagePreview ? (
          <>
            <Image
              src={section.imagePreview}
              alt="Poll cover"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange({ ...section, image: null, imagePreview: null })}
              className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-500 hover:text-gray-800 z-10"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-3xl">🖼</span>
            <span className="text-xs">Tap to add cover image</span>
          </button>
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <input
          type="text"
          placeholder="Add question"
          value={section.question}
          onChange={(e) => updateField('question', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300"
        />
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Option
        </label>
        <div className="flex flex-col gap-2">
          {section.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white placeholder:text-gray-300"
              />
              {section.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none"
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

      {/* Poll Length */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setPollLengthOpen((p) => !p)}
          className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white"
        >
          <span className="text-gray-600">Poll Length</span>
          <span className="text-gray-500">
            {section.pollDays}d {section.pollHours}h {section.pollMinutes}m{' '}
            {section.pollSeconds}s {pollLengthOpen ? '▲' : '▼'}
          </span>
        </button>

        {pollLengthOpen && (
          <div className="border border-gray-200 rounded-xl mt-2 p-4 bg-white">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 mb-1">Days</span>
                <NumberScroller
                  value={section.pollDays}
                  max={30}
                  onChange={(v) => updateField('pollDays', v)}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 mb-1">Hours</span>
                <NumberScroller
                  value={section.pollHours}
                  max={23}
                  onChange={(v) => updateField('pollHours', v)}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 mb-1">Min</span>
                <NumberScroller
                  value={section.pollMinutes}
                  max={59}
                  onChange={(v) => updateField('pollMinutes', v)}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400 mb-1">Sec</span>
                <NumberScroller
                  value={section.pollSeconds}
                  max={59}
                  onChange={(v) => updateField('pollSeconds', v)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No multiple answer */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 rounded-full bg-orange-400 flex-shrink-0" />
        <span className="text-sm text-gray-500">No multiple answer</span>
        <button
          type="button"
          onClick={() => updateField('allowMultiple', !section.allowMultiple)}
          className={`ml-auto w-10 h-6 rounded-full transition-colors ${
            section.allowMultiple ? 'bg-green-400' : 'bg-gray-200'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
              section.allowMultiple ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Action button */}
      {isLast && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            disabled={!isValid}
            className="w-full bg-lime text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-lime transition-colors"
          >
            Continue
          </button>
          {index > 0 && (
            <button
              type="button"
              onClick={onPublish}
              disabled={!isValid || loading}
              className="w-full bg-lime text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-lime transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function NewPollPage() {
  const router = useRouter()
  const [sections, setSections] = useState<PollSection[]>([emptySection()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateSection(index: number, updated: PollSection) {
    setSections((prev) => prev.map((s, i) => (i === index ? updated : s)))
  }

  function handleContinue() {
    setSections((prev) => [...prev, emptySection()])
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100)
  }

  async function handlePublish() {
    setLoading(true)
    setError(null)

    try {
      const user = JSON.parse(localStorage.getItem('polly_user') || '{}')

      for (const section of sections) {
        const validOptions = section.options.filter((o) => o.trim().length > 0)

        const res = await fetch('/api/polls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: section.question,
            description: '',
            status: 'registration_open',
            results_public: true,
            created_by: user.id,
            voting_closes_at: deadlineFromSection(section),
            candidates: validOptions.map((name) => ({ name, description: '' })),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.error || 'Failed to create poll')
          setLoading(false)
          return
        }
      }

      router.push('/admin')
    } catch (err) {
      setError('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm hover:text-gray-800"
        >
          ← Back
        </button>
        <span className="text-sm font-semibold text-gray-700">Create Poll</span>
        <div className="w-10" />
      </div>

      {/* Form */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {sections.map((section, index) => (
          <SectionForm
            key={index}
            section={section}
            index={index}
            onChange={(updated) => updateSection(index, updated)}
            isLast={index === sections.length - 1}
            onContinue={handleContinue}
            onPublish={handlePublish}
            loading={loading}
          />
        ))}

        {/* Show Publish on first section only if there's just one section */}
        {sections.length === 1 && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={
              loading ||
              sections[0].question.trim().length === 0 ||
              sections[0].options.filter((o) => o.trim().length > 0).length < 2
            }
            className="w-full bg-lime text-white rounded-2xl py-4 font-semibold text-base disabled:opacity-40 hover:bg-[#254d17] transition-colors mt-2"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        )}
      </div>
    </div>
  )
}