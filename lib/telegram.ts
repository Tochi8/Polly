import crypto from 'crypto'

interface TelegramUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
    auth_date: number
    hash: string
}

export function verifyTelegramData(data: TelegramUser): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN!

    const { hash, ...rest } = data

    const dataCheckString = Object.keys(rest)
        .sort()
        .map((key) => `${key}=${rest[key as keyof typeof rest]}`)
        .join('\n')

    const secretKey = crypto
        .createHash('sha256')
        .update(botToken)
        .digest()

    const computedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex')

    return computedHash === hash
}

export function isTelegramDataFresh(authDate: number): boolean {
    const oneDayInSeconds = 86400
    const now = Math.floor(Date.now() / 1000)
    return now - authDate < oneDayInSeconds
}

export function getTelegramUsername(user: TelegramUser): string {
    if (user.username) return user.username
    if (user.last_name) return `${user.first_name} ${user.last_name}`
    return user.first_name
}