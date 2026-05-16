import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { getPollPhase } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(
    req: Request,
    { params }: { params: { token: string } }
) {
    try {
        const { token } = params

        const { data: poll, error } = await supabase
            .from('polls')
            .select('*, candidates(*)')
            .eq('token', token)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
        }

        const currentPhase = getPollPhase(poll)

        if (currentPhase !== poll.status) {
            await supabase
                .from('polls')
                .update({ status: currentPhase })
                .eq('id', poll.id)
        }

        return NextResponse.json({
        poll: {
        id: poll.id,
        title: poll.title,
        status: currentPhase,
        registration_opens_at: poll.registration_opens_at,
        registration_closes_at: poll.registration_closes_at,
        voting_opens_at: poll.voting_opens_at,
        voting_closes_at: poll.voting_closes_at,
        token: poll.token,
        allowed_providers: poll.allowed_providers ?? ['x', 'discord', 'telegram'],
        community_id: poll.community_id ?? null,
    },
        candidates: poll.candidates,
    })

    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong, please try again' },
            { status: 500 }
        )
    }
}