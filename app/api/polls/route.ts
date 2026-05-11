import {supabase} from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { generatePollToken } from '@/lib/tokens'
import { getPollPhase } from '@/lib/utils'

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

        const shaped = await Promise.all(polls.map(async (poll: any) => {
            const currentPhase = getPollPhase(poll)
            
            if (currentPhase !== poll.status) {
                await supabase
                    .from('polls')
                    .update({ status: currentPhase })
                    .eq('id', poll.id)
            }

            return {
                id: poll.id,
                title: poll.title,
                status: currentPhase,
                description: poll.description,
                results_public: poll.results_public,
                created_by: poll.created_by,
                voting_closes_at: poll.voting_closes_at,
                voting_opens_at: poll.voting_opens_at,
                registration_opens_at: poll.registration_opens_at,
                registration_closes_at: poll.registration_closes_at,
                created_at: poll.created_at,
                token: poll.token,
                registeredCount: poll.registrations?.[0]?.count ?? 0,
                votesCount: poll.votes?.[0]?.count ?? 0,
            }
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
        const {
            title,
            description,
            results_public,
            created_by,
            registration_opens_at,
            registration_closes_at,
            voting_opens_at,
            voting_closes_at,
            candidates
        } = await req.json()

        const status = getPollPhase({
            registration_opens_at,
            registration_closes_at,
            voting_opens_at,
            voting_closes_at,
        })

        const token = generatePollToken()

        const { data: createdPoll, error: pollError } = await supabase
            .from('polls')
            .insert({
                title,
                description,
                status,
                results_public,
                created_by,
                token,
                registration_opens_at,
                registration_closes_at,
                voting_opens_at,
                voting_closes_at,
            })
            .select()
            .single()

        if (pollError) {
            return NextResponse.json({ error: pollError.message }, { status: 500 })
        }

        const candidateRows = candidates.map((c: { name: string; description: string }) => ({
            poll_id: createdPoll.id,
            name: c.name,
            description: c.description,
        }))

        const { data: createdCandidates, error: candidatesError } = await supabase
            .from('candidates')
            .insert(candidateRows)
            .select()

        if (candidatesError) {
            return NextResponse.json({ error: candidatesError.message }, { status: 500 })
        }

        return NextResponse.json({
            poll: createdPoll,
            candidates: createdCandidates,
            link: `/vote/${createdPoll.token}`
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create poll, please try again' },
            { status: 500 }
        )
    }
}