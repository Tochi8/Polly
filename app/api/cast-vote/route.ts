import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import  {generateVoteHash}  from '@/lib/hash'
import { recordVoteOnChain } from '@/lib/contract'

export async function POST(req: Request) {

    try {
        const {user_id, poll_id, candidate_id} = await req.json()

        const {data: poll, error: pollError} = await supabase
        .from('polls')
        .select('*')
        .eq('id', poll_id)
        .single()

        if(pollError) {
            return NextResponse.json({error: pollError.message}, {status: 500})
        }

        if(!poll) {
            return NextResponse.json({error: 'Poll could not be found!'}, {status: 404})
        }

        if(poll.status !== 'voting_open') {
            return NextResponse.json({error: 'Voting is not yet open for this poll, check back later'}, {status: 400})
        }

        const {data: registeredUser} = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user_id)
        .eq('poll_id', poll_id)
        .single()

        if(!registeredUser) {
            return NextResponse.json({error: 'You are not registered to vote on this poll!'}, {status: 400})
        }

        const {data: voteLocked} = await supabase
        .from('vote_locks')
        .select('*')
        .eq('user_id', user_id)
        .eq('poll_id', poll_id)
        .single()

        if(voteLocked) {
            return NextResponse.json({error: 'You have already voted!'}, {status: 400})
        }
        
        const { error: lockError } = await supabase
            .from('vote_locks')
            .insert({ user_id, poll_id })

        if (lockError) {
            return NextResponse.json({ error: lockError.message }, { status: 500 })
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('provider, provider_id')
            .eq('id', user_id)
            .single()

        if (userError || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const userHash = generateVoteHash(user.provider, user.provider_id, poll_id)

        const { data: vote, error: voteError } = await supabase
            .from('votes')
            .insert({
                poll_id,
                candidate_id,
                user_id,
                user_hash: userHash,
                status: 'pending'
            })
            .select()
            .single()

        if (voteError) {
            return NextResponse.json({ error: voteError.message }, { status: 500 })
        }

        const txHash = await recordVoteOnChain(userHash)

        const { error: updateError } = await supabase
        .from('votes')
        .update({ status: 'confirmed', tx_hash: txHash })
        .eq('id', vote.id)

        if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({vote: { ...vote, status: 'confirmed', tx_hash: txHash }})

    } catch (error) {
        return NextResponse.json(
            { error: 'Something went wrong, please try again' },
            { status: 500 }
        )
    }
} 