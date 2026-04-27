HEAD
# Polly — Verified Community Voting

Polly is a wallet-less, identity-gated voting platform built for online communities. It allows communities to run fair, transparent, and tamper-proof votes by ensuring only verified members can participate, and that each person can only vote once.

Users sign in with their existing social accounts — no wallets, no new accounts, no complexity. Every vote is hashed and recorded on-chain, making results permanent and independently verifiable by anyone.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Authentication | OAuth — Discord, Telegram, X |
| Smart Contract | Solidity |
| Blockchain | EVM-compatible |

---

## Features

**Identity-gated access**
Users verify their identity through OAuth (Discord, Telegram, or X). No wallet required. The platform works with accounts people already have.

**Two-phase voting system**
Every poll runs through two strict phases. Registration comes first — eligible members sign up during an open window. Once registration closes, the list is locked and cannot be changed. Voting opens after, and only registered members can participate.

**One vote per person**
Each vote is tied to a unique hash derived from the user's platform identity and the poll. The system enforces this at both the database level and the smart contract level — duplicates are impossible.

**Vote locking**
Before a vote is sent to the blockchain, the backend creates a vote lock for that user. This prevents double submissions even if something goes wrong mid-transaction.

**On-chain recording**
Every confirmed vote is recorded in a Solidity smart contract. The results are immutable — they cannot be altered after the fact. Anyone can independently verify the outcome.

**Admin dashboard**
Poll organisers can create and manage polls, open and close registration and voting windows, monitor participation in real time, and view the full voter registry.

**Result verification**
Voters receive a personal vote receipt hash after casting their vote. After the poll closes, anyone can use this hash to verify their vote was counted on-chain.

---

## Project Structure

```
polly-app/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── login/
│   │   └── page.tsx                      # Login page
│   ├── admin/
│   │   ├── page.tsx                      # Admin dashboard
│   │   └── polls/
│   │       └── new/
│   │           └── page.tsx              # Create new poll
│   ├── vote/
│   │   └── [token]/
│   │       └── page.tsx                  # Voting page (token-gated)
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts              # OAuth callback — find or create user
│       ├── polls/
│       │   ├── route.ts                  # GET all polls, POST create poll
│       │   └── [id]/
│       │       └── route.ts              # GET, PATCH, DELETE a specific poll
│       ├── registrations/
│       │   └── route.ts                  # POST register a user for a poll
│       └── vote/
│           └── route.ts                  # POST cast a vote
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── AdminBottomNav.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Modal.tsx
│   ├── polls/
│   │   ├── PollCard.tsx
│   │   ├── PollForm.tsx
│   │   ├── VoterList.tsx
│   │   └── ResultsChart.tsx
│   └── vote/
│       ├── VotingCard.tsx
│       ├── AlreadyVoted.tsx
│       ├── PollClosed.tsx
│       ├── InvalidLink.tsx
│       ├── WrongAccount.tsx
│       └── ValidatingLink.tsx
│
├── lib/
│   ├── supabase.ts                       # Supabase client
│   ├── auth.ts                           # Auth helpers
│   ├── tokens.ts                         # Token generation and validation
│   └── utils.ts                          # Shared utilities
│
├── hooks/
│   ├── useUser.ts
│   ├── usePolls.ts
│   └── useVoters.ts
│
├── types/
│   └── index.ts                          # Shared TypeScript interfaces
│
├── .env.example                          # Environment variable template
├── .gitignore
└── README.md
```

---

## Roadmap

### Done
- [x] Project setup — Next.js, TypeScript, Tailwind, Supabase
- [x] Database schema — all 6 tables created and confirmed
- [x] Design system — colours, typography, component library
- [x] UI components — Button, Input, Badge, Spinner, Modal
- [x] Poll components — PollCard, PollForm, VoterList, ResultsChart
- [x] Vote components — VotingCard, AlreadyVoted, PollClosed, InvalidLink, WrongAccount
- [x] `auth/callback/route.ts` — OAuth callback, find or create user
- [x] `polls/route.ts` — GET all polls, POST create poll with candidates
- [x] `polls/[id]/route.ts` — GET one poll, PATCH update, DELETE

### In Progress
- [ ] `registrations/route.ts` — POST register a user for a poll
- [ ] `vote/route.ts` — POST cast a vote (validate → lock → hash → blockchain → confirm)

### Up Next
- [ ] `lib/hash.ts` — generate unique vote hash per user per poll
- [ ] Solidity smart contract — record votes by hash, enforce one vote per hash
- [ ] Server wallet setup — backend sends transactions to the contract
- [ ] Wire all frontend pages to the backend API
- [ ] End-to-end testing of the full registration and voting flow
- [ ] Deploy
