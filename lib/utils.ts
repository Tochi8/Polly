export function getPollPhase(poll: {
    registration_opens_at: string | null
    registration_closes_at: string | null
    voting_opens_at: string | null
    voting_closes_at: string | null
}): string {
    const now = new Date()

    if (!poll.registration_opens_at) return 'draft'

    if (now < new Date(poll.registration_opens_at)) return 'upcoming'
    if (now < new Date(poll.registration_closes_at!)) return 'registration_open'
    if (now < new Date(poll.voting_opens_at!)) return 'registration_closed'
    if (now < new Date(poll.voting_closes_at!)) return 'voting_open'
    return 'closed'
}