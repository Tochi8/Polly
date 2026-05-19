'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

function PollyLogo() {
  return (
    <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="2" width="5" height="28" rx="1" fill="#2d5a1b"/>
      <rect x="5" y="2" width="9" height="6" rx="1" fill="#2d5a1b"/>
      <rect x="14" y="2" width="6" height="6" rx="1" fill="#4a8a2d"/>
      <rect x="14" y="8" width="6" height="6" rx="1" fill="#2d5a1b"/>
      <rect x="5" y="14" width="9" height="6" rx="1" fill="#2d5a1b"/>
      <circle cx="2.5" cy="5" r="1" fill="#4a8a2d"/>
      <circle cx="2.5" cy="27" r="1" fill="#4a8a2d"/>
      <circle cx="17" cy="5" r="1" fill="#4a8a2d"/>
      <circle cx="10" cy="17" r="1" fill="#4a8a2d"/>
      <text x="26" y="23" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="18" fill="#ffffff" letterSpacing="-0.5">Polly</text>
    </svg>
  )
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F2F0EC] font-sans">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 lg:px-12 py-4 bg-[#0D0D0D] sticky top-0 z-50 border-b border-[#0D0D0D]">
        <PollyLogo />
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => window.open('https://www.notion.so/Docs-360eda9e871d8069af11f9799622de08?source=copy_link')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Docs
          </button>
          <button
            onClick={() => window.open('https://www.notion.so/About-Polly-360eda9e871d80e48698f7fd51e0a795?source=copy_link')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#2d5a1b] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#254d17] transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-5 lg:px-12 pt-12 lg:pt-24 pb-8 lg:pb-16 max-w-lg lg:max-w-5xl mx-auto text-center">
        <h1 className="text-[2.1rem] lg:text-[3.2rem] font-bold text-gray-900 leading-tight tracking-tight mb-4">
          Voting that online communities <span className="text-[#2d5a1b]">can trust.</span>
        </h1>
        <p className="text-[15px] lg:text-[17px] text-gray-500 leading-relaxed mb-8 max-w-sm lg:max-w-xl mx-auto">
          Polly lets your community run polls where every voter is verified, every vote is transparent, locked on-chain, and anyone can check the result. No complex wallet setup.
        </p>
        <div className="flex flex-col lg:flex-row gap-3 max-w-xs lg:max-w-sm mx-auto">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] active:scale-[0.98] transition-all"
          >
            Get started
          </button>
          <button
            onClick={() => window.open('https://www.notion.so/Docs-360eda9e871d8069af11f9799622de08?source=copy_link')}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-semibold text-[15px] hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Read the docs →
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-5 lg:px-12 pb-12 lg:pb-20 max-w-lg lg:max-w-5xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-sm lg:text-base text-gray-500 leading-relaxed">
          Four phases that keeps every vote honest and every result verifiable
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
        <div className="bg-white rounded-2xl p-5 lg:p-7 border border-gray-100">
           <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <span className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-xs font-bold text-amber-600">01</span>
              <h3 className="text-sm lg:text-base font-bold text-gray-900">Community Registration</h3>
           </div>
              <p className="text-sm text-gray-500 leading-relaxed">
              The admin creates a community and opens a registration window. Interested members sign in with Google, Discord, or X to join the community. Once registration closes, the community member list is locked permanently.
              </p>
          </div>

        <div className="bg-white rounded-2xl p-5 lg:p-7 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">02</span>
              <h3 className="text-sm lg:text-base font-bold text-gray-900">Poll Registration</h3>
          </div>
              <p className="text-sm text-gray-500 leading-relaxed">
              The admin creates a poll and opens a registration window. Only community members can register for the poll by signing in with the same account they used to join the community. Once registration closes, the voter list is locked permanently.
              </p>
        </div>

        <div className="bg-white rounded-2xl p-5 lg:p-7 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <span className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-xs font-bold text-green-600">03</span>
              <h3 className="text-sm lg:text-base font-bold text-gray-900">Voting</h3>
          </div>
              <p className="text-sm text-gray-500 leading-relaxed">
              Only registered community members can vote. Each person gets exactly one vote. A unique hash is generated and sent to the blockchain. Your identity stays private, but your vote is permanent.
              </p>
        </div>

        <div className="bg-white rounded-2xl p-5 lg:p-7 border border-gray-100">
          <div className="flex items-center gap-3 mb-3 lg:mb-4">
            <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-xs font-bold text-purple-600">04</span>
              <h3 className="text-sm lg:text-base font-bold text-gray-900">Verification</h3>
          </div>
              <p className="text-sm text-gray-500 leading-relaxed">
              Once voting closes, every vote is on-chain and permanent. Anyone can independently verify results using the public transaction record.
              </p>
        </div>
      </div>
    </section>

      {/* ── FEATURES ── */}
      <section className="px-5 lg:px-12 pb-12 lg:pb-20 max-w-lg lg:max-w-5xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Built to prevent manipulation</h2>
          <p className="text-sm lg:text-base text-gray-500 leading-relaxed">
            Every layer is designed to close the gaps that make community voting untrustworthy, with a secure process to produce real results
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-purple-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">Real identity, no wallet</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Sign in with social accounts you already have. No crypto wallet required.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-red-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">One person, one vote</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Our verification system makes it hard to duplicate votes.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">Results on-chain</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Nobody can alter a result after it's recorded.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-green-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">Publicly verifiable</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Anyone can verify results with a receipt hash.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-amber-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">Locked voter list</h3>
            <p className="text-xs text-gray-500 leading-relaxed">No adding voters after registration closes.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 border border-gray-100">
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-3 lg:mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 mb-1 leading-snug">No gas fees</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Server handles blockchain fees so it costs you nothing to vote.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 lg:px-12 pb-14 lg:pb-24 max-w-lg lg:max-w-5xl mx-auto">
        <div className="bg-[#2d5a1b] rounded-3xl p-8 lg:p-16 text-center">
          <h2 className="text-xl lg:text-3xl font-bold text-white mb-2 lg:mb-3">
            Ready to run a fair vote for your community?
          </h2>
          <p className="text-sm lg:text-base text-green-200 mb-6 lg:mb-8 leading-relaxed max-w-lg mx-auto">
            Create your first community and poll in minutes. Share the link and let your community decide transparently.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full lg:w-auto lg:px-12 bg-white text-[#2d5a1b] rounded-2xl py-4 font-bold text-[15px] hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Get started
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D0D0D] px-5 lg:px-12 py-8 lg:py-12">
        <div className="max-w-lg lg:max-w-5xl mx-auto">
          <div className="lg:flex lg:items-start lg:justify-between mb-5 lg:mb-8">
            <div className="mb-5 lg:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <svg width="80" height="22" viewBox="0 0 80 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="1" width="4" height="20" rx="1" fill="#4a8a2d"/>
                  <rect x="4" y="1" width="7" height="5" rx="1" fill="#4a8a2d"/>
                  <rect x="11" y="1" width="5" height="5" rx="1" fill="#6aaa4d"/>
                  <rect x="11" y="6" width="5" height="5" rx="1" fill="#4a8a2d"/>
                  <rect x="4" y="11" width="7" height="5" rx="1" fill="#4a8a2d"/>
                  <text x="22" y="16" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="14" fill="#ffffff" letterSpacing="-0.5">Polly</text>
                </svg>
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Verified, tamper-proof voting for online communities.
              </p>
            </div>

            <div className="hidden lg:flex items-start gap-16">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</p>
                <Link href="https://www.notion.so/Docs-360eda9e871d8069af11f9799622de08?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Docs</Link>
                <Link href="https://www.notion.so/About-Polly-360eda9e871d80e48698f7fd51e0a795?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">About</Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Legal</p>
                <Link href="https://www.notion.so/Privacy-Policy-360eda9e871d806fa139c6c2b9860aaa?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</Link>
                <Link href="https://www.notion.so/Terms-of-Use-360eda9e871d80e29d14eaf199180f94?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Follow</p>
                <Link href="https://x.com/usepolly_" className="text-xs text-gray-500 hover:text-white transition-colors">X</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-5 flex items-center justify-between">
            <p className="text-xs text-gray-600">© 2026 Polly. All rights reserved.</p>

            {/* Mobile links */}
            <div className="flex lg:hidden items-center gap-4">
              <Link href="https://www.notion.so/About-Polly-360eda9e871d80e48698f7fd51e0a795?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">About</Link>
              <Link href="https://www.notion.so/Privacy-Policy-360eda9e871d806fa139c6c2b9860aaa?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</Link>
              <Link href="https://www.notion.so/Terms-of-Use-360eda9e871d80e29d14eaf199180f94?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</Link>
              <Link href="https://www.notion.so/Docs-360eda9e871d8069af11f9799622de08?source=copy_link" className="text-xs text-gray-500 hover:text-white transition-colors">Docs</Link>
            </div>

            {/* Desktop social icons */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="https://x.com/usepolly_" className="text-gray-500 hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.3 1.6h3.4L14.5 10l8.5 11.2h-7l-4.9-6.4-5.7 6.4H2l7.7-8.7L1.7 1.6h7.2l4.5 5.9 5-5.9zm-1.2 18.6h1.9L7 3.5H4.9l12.2 16.7z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile social icons */}
          <div className="flex lg:hidden items-center gap-4 mt-4">
            <a href="https://x.com/usepolly_" className="text-gray-500 hover:text-white transition-colors">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.3 1.6h3.4L14.5 10l8.5 11.2h-7l-4.9-6.4-5.7 6.4H2l7.7-8.7L1.7 1.6h7.2l4.5 5.9 5-5.9zm-1.2 18.6h1.9L7 3.5H4.9l12.2 16.7z"/>
              </svg>
            </a>
          </div>

        </div>
      </footer>
    </div>
  )
}