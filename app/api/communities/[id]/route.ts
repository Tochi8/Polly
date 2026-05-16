import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: community, error } = await supabase
            .from('communities')
            .select(`*, community_members(count)`)
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!community) {
            return NextResponse.json({ error: 'Community not found' }, { status: 404 })
        }

        return NextResponse.json({
            community: {
                ...community,
                memberCount: community.community_members?.[0]?.count ?? 0,
            }
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch community, please try again' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { name, description, registration_open, registration_deadline } = await req.json()

        const { data: community, error } = await supabase
            .from('communities')
            .update({ name, description, registration_open, registration_deadline })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ community })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update community, please try again' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { error } = await supabase
            .from('communities')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Community deleted successfully' })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete community, please try again' },
            { status: 500 }
        )
    }
}