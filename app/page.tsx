'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F2F0EC] font-sans">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-5 py-4 bg-[#F2F0EC] sticky top-0 z-50 border-b border-[#E2DED8]">
        <div className="w-8 h-2 bg-gray-300 rounded" />
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-medium text-gray-600 cursor-pointer hidden sm:block"
            onClick={() => router.push('/login')}
          >
            + Create Poll
          </span>
          {/* Search icon */}
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          {/* Bell icon */}
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          {/* Menu icon */}
          <button className="text-gray-500 hover:text-gray-800 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-green-400" />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-5 pt-10 pb-8 max-w-lg mx-auto text-center">
        <h1 className="text-[2rem] font-bold text-gray-900 leading-tight tracking-tight mb-3">
          Fair votes for communities that actually care
        </h1>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-7 max-w-sm mx-auto">
          Polly lets your community run polls where every voter is verified, every vote is locked on-chain, and anyone can check the result. No wallets. No complexity.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#2d5a1b] text-white rounded-2xl py-4 font-semibold text-[15px] hover:bg-[#254d17] active:scale-[0.98] transition-all"
          >
            Sign in to get started
          </button>
          <button
            onClick={() => window.open('/docs', '_blank')}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 font-semibold text-[15px] hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Read the documentation →
          </button>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-5 max-w-lg mx-auto mb-10">
        <div className="w-full rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
            alt="Community members at a town hall meeting with hands raised to vote"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Real communities deserve real governance tools
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-5 pb-10 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">How it works</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Three phases that keep every vote honest and every result verifiable
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Phase 01 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <span className="inline-block bg-[#F5A623] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Phase 01
            </span>
            <h3 className="text-base font-bold text-gray-900 mb-2">Registration</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The admin opens a registration window. Community members sign in with their Discord, Telegram, or X account — no new account needed. Once registration closes, the voter list is locked. Nobody can be added or removed after that point.
            </p>
          </div>

          {/* Phase 02 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <span className="inline-block bg-[#00B4D8] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Phase 02
            </span>
            <h3 className="text-base font-bold text-gray-900 mb-2">Voting</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              When voting opens, only registered members can cast a vote. Each person gets exactly one vote. A unique hash is generated for your vote and sent to the blockchain — your identity stays private but your vote is permanently recorded.
            </p>
          </div>

          {/* Phase 03 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <span className="inline-block bg-[#C77DFF] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Phase 03
            </span>
            <h3 className="text-base font-bold text-gray-900 mb-2">Verification</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Once voting closes, every vote is on-chain and permanent. Anyone — including people who didn't vote — can independently verify the results using the public transaction record. No one can change the outcome after the fact.
            </p>
          </div>
        </div>
      </section>

      {/* ── BUILT FOR SECURITY ── */}
      <section className="px-5 pb-10 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Built to prevent manipulation</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Every layer of Polly is designed to close the gaps that make online votes untrustworthy
          </p>
        </div>

        <div className="flex flex-col gap-3">

          {/* Web2 Identity */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Real identity, no wallet</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Voters sign in with accounts they already have — Discord, Telegram, or X. OAuth verification confirms they're real people, not bots. No crypto wallet or new account required.
            </p>
          </div>

          {/* Anti-Sybil */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">One person, one vote — enforced</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Each voter gets a unique hash built from their identity and a secret salt. This hash is checked on-chain before any vote is accepted. Duplicate votes are mathematically impossible.
            </p>
          </div>

          {/* On-Chain */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Results that can't be touched</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every confirmed vote is written to the Polygon blockchain. Nobody — including us — can alter a result after it's recorded. The chain is the final word.
            </p>
          </div>

          {/* Trustless */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Verify without trusting us</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You don't have to take our word for it. Every voter gets a receipt hash they can look up on-chain themselves. The results are public and independently verifiable by anyone.
            </p>
          </div>

          {/* Two-phase */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Registration and voting are separate</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The voter list is locked before voting opens. This prevents last-minute manipulation — you can't add fake voters after seeing which way the wind blows.
            </p>
          </div>

          {/* Gasless */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Voters never touch crypto</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The server wallet handles all blockchain transactions on behalf of voters. No gas fees, no MetaMask, no friction. It feels like a normal web app because it is one.
            </p>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 pb-12 max-w-lg mx-auto">
        <div className="bg-[#2d5a1b] rounded-3xl p-7 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Ready to run a fair vote?
          </h2>
          <p className="text-sm text-green-200 mb-6 leading-relaxed">
            Create your first poll in minutes. Share a link. Let your community decide — transparently.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-white text-[#2d5a1b] rounded-2xl py-4 font-bold text-[15px] hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            Sign in to get started
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D0D0D] px-5 py-8">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-gray-500 mb-5">
            © 2026 Polly. Empowering communities with verified, tamper-proof voting.
          </p>

          {/* Links */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-xs text-gray-400 hover:text-white transition-colors">About</button>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">Privacy</button>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">Terms</button>
              <button
                onClick={() => window.open('/docs', '_blank')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Docs
              </button>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {/* X */}
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.3 1.6h3.4L14.5 10l8.5 11.2h-7l-4.9-6.4-5.7 6.4H2l7.7-8.7L1.7 1.6h7.2l4.5 5.9 5-5.9zm-1.2 18.6h1.9L7 3.5H4.9l12.2 16.7z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}