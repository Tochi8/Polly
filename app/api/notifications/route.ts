import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const admin_id = searchParams.get('admin_id')

        if (!admin_id) {
            return NextResponse.json(
                { error: 'admin_id is required' },
                { status: 400 }
            )
        }

        const { data: polls, error: pollsError } = await supabase
            .from('polls')
            .select('id, title, voting_closes_at')
            .eq('created_by', admin_id)

        if (pollsError) {
            return NextResponse.json({ error: pollsError.message }, { status: 500 })
        }

        if (!polls || polls.length === 0) {
            return NextResponse.json({ notifications: [] })
        }

        const pollIds = polls.map((p: { id: string }) => p.id)

        const { data: votes, error: votesError } = await supabase
            .from('votes')
            .select(`
                id,
                created_at,
                poll_id,
                users (username, provider),
                candidates (name)
            `)
            .in('poll_id', pollIds)
            .eq('status', 'confirmed')
            .order('created_at', { ascending: false })
            .limit(50)

        if (votesError) {
            return NextResponse.json({ error: votesError.message }, { status: 500 })
        }

        const pollMap = polls.reduce((acc: any, poll: any) => {
            acc[poll.id] = poll
            return acc
        }, {})

        const notifications = votes.map((vote: any) => ({
            id: vote.id,
            username: vote.users?.username ?? 'Someone',
            provider: vote.users?.provider ?? '',
            pollTitle: pollMap[vote.poll_id]?.title ?? 'a poll',
            pollClosesAt: pollMap[vote.poll_id]?.voting_closes_at ?? '',
            createdAt: vote.created_at,
        }))

        return NextResponse.json({ notifications })

    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong, please try again' },
            { status: 500 }
        )
    }
}