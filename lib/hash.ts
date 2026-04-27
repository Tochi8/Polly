import crypto from 'crypto'

export function generateVoteHash (
    provider: string,
    provider_id: string,
    poll_id: string,
): string{
    const salt = process.env.SECRET_SALT!
    const input = `${provider}_${provider_id}_${poll_id}_${salt}`
    return crypto.createHash('sha256').update(input).digest('hex')
}