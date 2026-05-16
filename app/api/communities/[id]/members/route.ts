import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: members, error } = await supabase
            .from('community_members')
            .select(`
                *,
                users(id, username, provider, created_at)
            `)
            .eq('community_id', id)
            .order('joined_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const shaped = members.map((m: any) => ({
            id: m.id,
            community_id: m.community_id,
            joined_at: m.joined_at,
            user_id: m.users.id,
            username: m.users.username,
            provider: m.users.provider,
            member_since: m.users.created_at,
        }))

        return NextResponse.json({ members: shaped })

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch members, please try again' },
            { status: 500 }
        )
    }
}