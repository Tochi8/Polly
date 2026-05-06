import crypto from 'crypto'

export function generatePollToken(): string {
    return crypto.randomBytes(16).toString('hex')
}