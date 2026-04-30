import {supabase} from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    try {
    const {user_id, poll_id} = await req.json()

    const {data: poll, error: pollError} = await supabase
    .from('polls')
    .select()
    .single()

    if(pollError) {
        return NextResponse.json({error: pollError.message}, {status: 500})
    }

    if (!poll) {
            return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    if(poll.status !== 'registration_open') {
        return NextResponse.json({error: 'Registration is not open for this poll'}, {status: 400})
    }
    
    const {data: alreadyResistered} = await supabase
    .from('registerations')
    .select('*')
    .eq('poll_id', poll_id)
    .eq('user_id', user_id)
    .single()

    if(alreadyResistered) {
        return NextResponse.json({error: 'You are already registered for this poll'}, {status: 400})
    }

    const {data: registration, error} = await supabase
    .from('registerations')
    .insert({poll_id, user_id})
    .select()
    .single()

    if(error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

    return NextResponse.json({registration})

    } catch (error) {
        return NextResponse.json({error: 'Something went wrong, please try again'}, {status: 500})
    }
}