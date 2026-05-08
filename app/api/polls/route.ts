import {supabase} from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { generatePollToken } from '@/lib/tokens'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const created_by = searchParams.get('created_by')

        let query = supabase
            .from('polls')
            .select(`
                *,
                candidates(*),
                registrations(count),
                votes(count)
            `)

        if (created_by) {
            query = query.eq('created_by', created_by)
        }

        const { data: polls, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        
        const shaped = polls.map((poll: any) => ({
            ...poll,
            registeredCount: poll.registrations?.[0]?.count ?? 0,
            votesCount: poll.votes?.[0]?.count ?? 0,
        }))

        return NextResponse.json({ polls: shaped })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch polls, please try again' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {

    try {
        const {title, description, status, results_public, created_by, candidates} = await req.json()

    const token = generatePollToken()

const {data: createPoll, error: pollError} = await supabase
    .from('polls')
    .insert({ title, description, status, results_public, created_by, token })
    .select()
    .single()

    if(pollError) {
        return NextResponse.json({error: pollError.message}, {status: 500})
    }

    const candidateRow = candidates.map((c:{ name: string, description: string}) => ({
        poll_id: createPoll.id,
        name: c.name,
        description: c.description
    }))

    const {data: createdCandidates, error: candidatesError} = await supabase
    .from('candidates')
    .insert(candidateRow)
    .select()

    if(candidatesError) {
        return NextResponse.json({error: candidatesError.message}, {status: 500})
    }

    return NextResponse.json({
    poll: createPoll,
    candidates: createdCandidates,
    link: `/vote/${createPoll.token}`
})

    } catch (error) {
        return NextResponse.json({error: 'failed to create poll, please try again'}, {status: 500})
    }
}