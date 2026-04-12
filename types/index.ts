export interface User {
    id: string
    provider: 'discord' | 'telegram' | 'x'
    providerId: string
    username: string
    role: 'admin' | 'voter'
    createdAt: string
}

export interface Poll {
    id: string
    createdBy: string
    title: string
    description?: string
    status: 'draft' | 'live' | 'closed'
    resultsPublic: boolean
    closesAt?: string
    createdAt: string
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