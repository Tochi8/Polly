export interface User {
  id: string
  username: string
  provider: string
  role: string
   created_at: string
}

export interface Poll {
  id: string
  title: string
  status: string
  voting_closes_at: string
  voting_opens_at: string
  registration_opens_at: string
  registration_closes_at: string
  created_by: string
  registeredCount: number
  votesCount: number
  token: string
  allowed_providers: string[]
}

export interface Candidate {
    id: string
    pollId: string
    name: string
    description?: string
}

export interface PollVoter {
    id: string
    pollId: string
    identifier:string
    token: string
    used: boolean
    votedAt?: string
}

export interface Vote {
    id: string
    pollId: string
    candidateId: string
    voterTokenId: string
    createdAt: string
}

export interface CandidatesWithVotes extends Candidate{
    voteCount: number
}