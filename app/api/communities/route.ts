import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { generatePollToken } from '@/lib/tokens'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const created_by = searchParams.get('created_by')

        let query = supabase
            .from('communities')
            .select(`
                *,
                community_members(count)
            `)

        if (created_by) {
            query = query.eq('created_by', created_by)
        }

        const { data: communities, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const shaped = communities.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            created_by: c.created_by,
            invite_token: c.invite_token,
            registration_open: c.registration_open,
            registration_deadline: c.registration_deadline,
            created_at: c.created_at,
            memberCount: c.community_members?.[0]?.count ?? 0,
        }))

        return NextResponse.json({ communities: shaped })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch communities, please try again' },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const { name, description, created_by, registration_deadline } = await req.json()

        if (!name || !created_by) {
            return NextResponse.json(
                { error: 'Name and created_by are required' },
                { status: 400 }
            )
        }

        const invite_token = generatePollToken()

        const { data: community, error } = await supabase
            .from('communities')
            .insert({
                name,
                description,
                created_by,
                invite_token,
                registration_open: true,
                registration_deadline: registration_deadline ?? null,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            community,
            invite_link: `/join/${community.invite_token}`
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create community, please try again' },
            { status: 500 }
        )
    }
}