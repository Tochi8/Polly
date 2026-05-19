import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { invite_token, user_id } = await req.json()

        if (!invite_token || !user_id) {
            return NextResponse.json(
                { error: 'invite_token and user_id are required' },
                { status: 400 }
            )
        }

        const { data: community, error: communityError } = await supabase
            .from('communities')
            .select('*')
            .eq('invite_token', invite_token)
            .single()

        if (communityError || !community) {
            return NextResponse.json({ error: 'Invalid invite link' }, { status: 404 })
        }

        if (!community.registration_open) {
            return NextResponse.json(
                { error: 'Registration for this community is closed' },
                { status: 400 }
            )
        }

        if (community.registration_deadline) {
        const deadline = new Date(community.registration_deadline)
        if (new Date() > deadline && community.registration_open) {
        return NextResponse.json(
        { error: 'Registration deadline for this community has passed' },
        { status: 400 }
            )
            }
        }

        const { data: existingMember } = await supabase
            .from('community_members')
            .select('id')
            .eq('community_id', community.id)
            .eq('user_id', user_id)
            .maybeSingle()

        if (existingMember) {
            return NextResponse.json({
                message: 'Already a member',
                community,
                alreadyMember: true,
            })
        }

        const { error: joinError } = await supabase
            .from('community_members')
            .insert({
                community_id: community.id,
                user_id,
            })

        if (joinError) {
            return NextResponse.json({ error: joinError.message }, { status: 500 })
        }

        return NextResponse.json({
            message: 'Successfully joined community',
            community,
            alreadyMember: false,
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to join community, please try again' },
            { status: 500 }
        )
    }
}