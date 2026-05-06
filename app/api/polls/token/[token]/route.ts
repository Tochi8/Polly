import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request, {params}: {params: {token: string}}) {

    const {token} = params

    try {
        const {data: poll, error} = await supabase
        .from('polls')
        .select('*, candidates(*)')
        .eq('token', token)
        .single()

        if(error) {
            return NextResponse.json({error: error.message}, {status: 500})
        }

        if(!poll) {
            return NextResponse.json({error: 'Poll not found'}, {status: 404})
        }

        return NextResponse.json({poll: {
            id: poll.id,
                title: poll.title,
                status: poll.status,
                voting_closes_at: poll.voting_closes_at,
                token: poll.token,
            },
            candidates: poll.candidates
        })

    } catch (error) {
        return NextResponse.json(
            {error: 'Something went wrong, please try again'},
            {status: 500}
        )
    }
} 