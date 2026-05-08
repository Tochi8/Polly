import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { verifyTelegramData, isTelegramDataFresh, getTelegramUsername } from '@/lib/telegram'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { telegramData, role } = body

        if (!verifyTelegramData(telegramData)) {
            return NextResponse.json(
                { error: 'Invalid Telegram data — verification failed' },
                { status: 401 }
            )
        }

        if (!isTelegramDataFresh(telegramData.auth_date)) {
            return NextResponse.json(
                { error: 'Telegram session expired, please try again' },
                { status: 401 }
            )
        }

        const provider = 'telegram'
        const provider_id = String(telegramData.id)
        const username = getTelegramUsername(telegramData)

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('provider', provider)
            .eq('provider_id', provider_id)
            .single()

        if (existingUser) {
            return NextResponse.json({ user: existingUser })
        }

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({ provider, provider_id, username, role })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ user: newUser })

    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong, please try again' },
            { status: 500 }
        )
    }
}