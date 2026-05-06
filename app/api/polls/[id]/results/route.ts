import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: candidates, error: candidatesError } = await supabase
            .from('candidates')
            .select('id, name')
            .eq('poll_id', id)

        if (candidatesError) {
            return NextResponse.json({ error: candidatesError.message }, { status: 500 })
        }

        const { data: votes, error: votesError } = await supabase
            .from('votes')
            .select('candidate_id')
            .eq('poll_id', id)
            .eq('status', 'confirmed')

        if (votesError) {
            return NextResponse.json({ error: votesError.message }, { status: 500 })
        }

        const totalVotes = votes.length

        const results = candidates.map((candidate: {id: string, name: string}) => {
            const count = votes.filter(
                (v: {candidate_id: string}) => v.candidate_id === candidate.id
            ).length

            const percentage =
                totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

            return {
                id: candidate.id,
                name: candidate.name,
                votes: count,
                percentage,
            }
        })

        results.sort((a: {votes: number}, b: {votes: number}) => b.votes - a.votes)

        return NextResponse.json({ results, totalVotes })

    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong, please try again' },
            { status: 500 }
        )
    }
}